import { TreeItem, ExtensionContext, TreeDataProvider, EventEmitter, Event, Disposable } from 'vscode'
import throttle from 'lodash/throttle'
import { notEmpty } from '../../utils/utils'
import { BaseTreeItem } from '../items/Base'
import { ProgressRootItem } from '../items/ProgressRootItem'
import { ProgressProjectItem } from '../items/ProgressProjectItem'
import { EditorPanel } from '../../webview/panel'
import { THROTTLE_DELAY } from '../../meta'
import { Config, Global, CurrentFile, ResolvedRootContext } from '~/core'

export class ProgressProvider implements TreeDataProvider<BaseTreeItem> {
  protected name = 'ProgressProvider'
  private _onDidChangeTreeData: EventEmitter<BaseTreeItem | undefined> = new EventEmitter<BaseTreeItem | undefined>()
  private _globalLoaderDisposable: Disposable | undefined
  readonly onDidChangeTreeData: Event<BaseTreeItem | undefined> = this._onDidChangeTreeData.event

  constructor(private ctx: ExtensionContext) {
    const throttledRefresh = throttle(() => this.refresh(), THROTTLE_DELAY)
    const updateGlobalLoaderSubscription = () => {
      this._globalLoaderDisposable?.dispose()
      this._globalLoaderDisposable = Global.loader?.onDidChange(throttledRefresh)
    }

    ctx.subscriptions.push(
      EditorPanel.onDidChange(throttledRefresh),
      CurrentFile.loader.onDidChange(throttledRefresh),
      Global.onDidChangeLoader(() => {
        updateGlobalLoaderSubscription()
        throttledRefresh()
      }),
      Global.onDidChangeEnabled(throttledRefresh),
      new Disposable(() => this._globalLoaderDisposable?.dispose()),
    )

    updateGlobalLoaderSubscription()
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }

  getTreeItem(element: BaseTreeItem): TreeItem {
    return element
  }

  private async getProjectItem(context: ResolvedRootContext) {
    const loader = await Global.getLoaderForRootContext(context)
    if (!loader)
      return

    return await Global.withRootContext(context, async() => {
      const coverages = loader.locales
        .map(locale => loader.getCoverage(locale))
        .filter(notEmpty)

      return new ProgressProjectItem(this.ctx, {
        loader,
        rootContext: context,
        sourceLanguage: Config.sourceLanguage,
        displayLanguage: Config.displayLanguage,
        ignoredLocales: Config.ignoredLocales,
        locales: loader.locales,
      }, coverages)
    })
  }

  async getChildren(element?: BaseTreeItem) {
    if (element)
      return await element.getChildren()

    const projectContexts = Global.getMonorepoRootContexts()
    if (projectContexts.length) {
      const items = []
      for (const context of projectContexts)
        items.push(await this.getProjectItem(context))
      return items.filter(notEmpty)
    }

    return Object.values(Global.allLocales)
      .map(node => CurrentFile.loader.getCoverage(node))
      .filter(notEmpty)
      .map(cov => new ProgressRootItem(this.ctx, cov))
  }
}
