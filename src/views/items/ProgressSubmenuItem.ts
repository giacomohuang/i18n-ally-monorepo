import { TreeItemCollapsibleState } from 'vscode'
import { LocaleTreeItem } from './LocaleTreeItem'
import { ProgressBaseItem } from './ProgressBaseItem'
import { ProgressRootItem } from './ProgressRootItem'
import i18n from '~/i18n'

export abstract class ProgressSubmenuItem extends ProgressBaseItem {
  constructor(protected root: ProgressRootItem, public readonly labelKey: string, public readonly icon?: string) {
    super(root.ctx, root.node, root.progressContext)
    this.id = `${root.id || 'progress'}-${this.node.locale}-${labelKey}`
  }

  // @ts-expect-error
  get iconPath() {
    if (this.icon)
      return this.getIcon(this.icon)
  }

  getLabel() {
    return i18n.t(this.labelKey) + this.getSuffix()
  }

  getSuffix() {
    return ` (${this.getKeys().length})`
  }

  abstract getKeys(): string[]

  // @ts-expect-error
  get collapsibleState() {
    if (this.getKeys().length)
      return TreeItemCollapsibleState.Collapsed
    else
      return TreeItemCollapsibleState.None
  }

  set collapsibleState(_) { }
  async getChildren() {
    return await this.withProgressContext(() => {
      const locales = Array.from(new Set([this.node.locale, this.root.sourceLanguage]))
      return this.getKeys()
        .map(key => this.root.loader.getTreeNodeByKey(key))
        .map(node => node && new LocaleTreeItem(this.ctx, node, true, this.node.locale, locales, this.root.loader))
        .filter(item => item) as LocaleTreeItem[]
    })
  }

  get loader() {
    return this.root.loader
  }

  get sourceLanguage() {
    return this.root.sourceLanguage
  }

  get locales() {
    return this.root.locales
  }

  async withProgressContext<T>(fn: () => T | Promise<T>): Promise<T> {
    return await this.root.withProgressContext(fn)
  }
}
