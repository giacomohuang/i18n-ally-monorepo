/* eslint-disable no-case-declarations */

// Protocol for exchanging data between webview/client/devtools
import { commands } from 'vscode'
import { TranslateKeys, RenameKey } from '../commands/manipulations'
import { EXT_ID } from '~/meta'
import { Commands } from '~/commands'
import { CurrentFile, Global, Config, ActionSource, Telemetry, TelemetryKey, Loader } from '~/core'
import i18n from '~/i18n'
import { isDev } from '~/env'

export interface Message {
  type: string
  _id?: number
  keypath?: string
  locale?: string
  value?: string
  route?: string
  data?: any
  commentId?: string
}

export class Protocol {
  ready = false
  pendingMessages: Message[] = []

  constructor(
    private readonly _postMessage: (message: Message) => Promise<void>,
    public extendHandler?: (message: Message) => Thenable<boolean | undefined>,
    public options?: {
      getLoader?: () => Loader | undefined
      withContext?: <T>(fn: () => T | Promise<T>) => Promise<T>
      extendConfig?: any
    },
  ) {

  }

  get loader() {
    return this.options?.getLoader?.() || CurrentFile.loader
  }

  get config() {
    const loader = this.loader
    const locales = loader?.locales || []
    return {
      debug: isDev,
      review: Config.reviewEnabled,
      locales,
      flags: locales.map(i => Config.tagSystem.getFlagName(i)),
      showFlags: Config.showFlags,
      sourceLanguage: Config.sourceLanguage,
      displayLanguage: Config.displayLanguage,
      enabledFrameworks: Config.enabledFrameworks,
      ignoredLocales: Config.ignoredLocales,
      translateOverrideExisting: Config.translateOverrideExisting,
      user: Config.reviewUser,

      ...this.options?.extendConfig,
    }
  }

  async withContext<T>(fn: () => T | Promise<T>): Promise<T> {
    if (this.options?.withContext)
      return await this.options.withContext(fn)

    return await fn()
  }

  async postMessage(message: Message) {
    this.pendingMessages.push(message)
    if (this.ready) {
      const pendingMessages = this.pendingMessages
      this.pendingMessages = []
      for (const msg of pendingMessages)
        await this._postMessage(msg)
    }
  }

  async updateConfig() {
    return await this.withContext(() => this.postMessage({
      type: 'config',
      data: this.config,
    }))
  }

  async updateI18nMessages() {
    return await this.postMessage({
      type: 'i18n',
      data: i18n.messages,
    })
  }

  switchToKey(key: string) {
    this.postMessage({
      type: 'switch-to',
      keypath: key,
    })
  }

  async handleMessages(message: Message) {
    const handled = this.extendHandler ? await Promise.resolve(this.extendHandler(message)) : undefined
    if (handled)
      return

    switch (message.type) {
      case 'ready':
        this.ready = true
        await this.postMessage({ type: 'ready' })
        await this.updateConfig()
        break

      case 'init':
        await this.updateI18nMessages()
        break

      case 'edit':
        await this.withContext(() => this.loader.write({
          keypath: message.data.keypath,
          locale: message.data.locale,
          value: message.data.value,
        }))
        break

      case 'rename-key':
        const newkey = await this.withContext(() => RenameKey({
          keypath: message.keypath!,
          loader: this.loader,
          actionSource: ActionSource.UiEditor,
        }))
        if (newkey)
          this.switchToKey(newkey)
        break

      case 'translate':
        await this.withContext(() => TranslateKeys({
          actionSource: ActionSource.UiEditor,
          loader: this.loader,
          ...message.data,
        }))
        break

      case 'review.description':
        await this.withContext(() => Global.reviews.promptEditDescription(message.keypath!))
        break

      case 'review.comment':
        await this.withContext(() => {
          Telemetry.track(TelemetryKey.ReviewAddComment, { source: ActionSource.UiEditor })
          return Global.reviews.addComment(message.keypath!, message.locale!, message.data!)
        })
        break

      case 'review.edit':
        await this.withContext(() => {
          Telemetry.track(TelemetryKey.ReviewEditComment, { source: ActionSource.UiEditor })
          return Global.reviews.editComment(message.keypath!, message.locale!, message.data!)
        })
        break

      case 'review.resolve':
        await this.withContext(() => {
          Telemetry.track(TelemetryKey.ReviewResolveComment, { source: ActionSource.UiEditor })
          return Global.reviews.resolveComment(message.keypath!, message.locale!, message.commentId!)
        })
        break

      case 'review.apply-suggestion':
        await this.withContext(() => Global.reviews.applySuggestion(message.keypath!, message.locale!, message.commentId!))
        break

      case 'open-builtin-settings':
        commands.executeCommand('workbench.extensions.action.configure', EXT_ID)
        break

      case 'open-search':
        commands.executeCommand(Commands.open_editor)
        break

      case 'translation.apply':
        await this.withContext(() => Global.reviews.applyTranslationCandidate(message.keypath!, message.locale!))
        break

      case 'translation.edit':
        await this.withContext(() => Global.reviews.promptEditTranslation(message.keypath, message.locale))
        break

      case 'translation.discard':
        await this.withContext(() => Global.reviews.discardTranslationCandidate(message.keypath!, message.locale!))
        break
    }
  }
}
