import { ExtensionContext, TreeItemCollapsibleState } from 'vscode'
import { BaseTreeItem } from './Base'
import { decorateLocale } from '~/utils'
import { Config, Coverage, CurrentFile, Global, Loader, ResolvedRootContext } from '~/core'

export interface ProgressContext {
  loader: Loader
  rootContext?: ResolvedRootContext
  sourceLanguage: string
  displayLanguage: string
  ignoredLocales: string[]
  locales: string[]
}

export abstract class ProgressBaseItem extends BaseTreeItem {
  constructor(public readonly ctx: ExtensionContext, public readonly node: Coverage, public readonly progressContext?: ProgressContext) {
    super(ctx)
  }

  get loader() {
    return this.progressContext?.loader || CurrentFile.loader
  }

  get sourceLanguage() {
    return this.progressContext?.sourceLanguage || Config.sourceLanguage
  }

  get displayLanguage() {
    return this.progressContext?.displayLanguage || Config.displayLanguage
  }

  get ignoredLocales() {
    return this.progressContext?.ignoredLocales || Config.ignoredLocales
  }

  get locales() {
    return this.progressContext?.locales || Global.allLocales
  }

  async withProgressContext<T>(fn: () => T | Promise<T>): Promise<T> {
    if (this.progressContext?.rootContext)
      return await Global.withRootContext(this.progressContext.rootContext, fn)

    return await fn()
  }

  getLabel() {
    return decorateLocale(this.node.locale)
  }

  collapsibleState = TreeItemCollapsibleState.Collapsed
}
