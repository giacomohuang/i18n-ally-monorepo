import { window } from 'vscode'
import { LocaleTreeItem, ProgressSubmenuItem } from '~/views'
import { CurrentFile, Global, Node, LocaleNode, LocaleRecord, ActionSource, Loader } from '~/core'
import i18n from '~/i18n'

export interface CommandOptions {
  keypath: string
  locale?: string
  from?: string
  locales?: string[]
  keyIndex?: number
  loader?: Loader
  actionSource?: ActionSource
}

export function getNodeOrRecord(item?: LocaleTreeItem | CommandOptions): LocaleNode | LocaleRecord | undefined {
  if (!item)
    return

  if (item instanceof LocaleTreeItem) {
    return item.node.type !== 'tree'
      ? item.node
      : undefined
  }

  const loader = item.loader || CurrentFile.loader

  if (item.locale)
    return loader.getRecordByKey(item.keypath, item.locale, true)
  else
    return loader.getNodeByKey(item.keypath, true)
}

export function getNode(item?: LocaleTreeItem | CommandOptions | ProgressSubmenuItem) {
  if (!item)
    return

  if (item instanceof ProgressSubmenuItem)
    return

  if (item instanceof LocaleTreeItem) {
    if (item.node.type === 'node')
      return item.node
    return
  }

  return (item.loader || CurrentFile.loader).getNodeByKey(item.keypath, true)
}

export async function getRecordFromNode(node: Node, defaultLocale?: string, loader: Loader = CurrentFile.loader) {
  if (node.type === 'tree')
    return

  if (node.type === 'record')
    return node

  if (node.type === 'node') {
    const locales = loader.getShadowLocales(node)
    const locale = defaultLocale || await window.showQuickPick(
      Global.visibleLocales,
      { placeHolder: i18n.t('prompt.choice_locale') },
    )
    if (!locale)
      return
    return locales[locale]
  }
}
