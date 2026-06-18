import { window } from 'vscode'
import { getNodeOrRecord, CommandOptions, getNode } from './common'
import { LocaleTreeItem, ProgressSubmenuItem } from '~/views'
import { Translator, CurrentFile, Config, Global, LocaleNode, AccaptableTranslateItem } from '~/core'
import i18n from '~/i18n'
import { Telemetry, TelemetryKey } from '~/core/Telemetry'

export async function promptForSourceLocale(defaultLocale: string, node?: LocaleNode, locales = Global.allLocales) {
  const placeHolder = i18n.t('prompt.select_source_language_for_translating', defaultLocale)

  const result = await window.showQuickPick(locales
    .map(locale => ({
      label: locale,
      description: node?.getValue(locale),
    })), {
    placeHolder,
  })

  if (result == null)
    return undefined

  return result.label || defaultLocale
}

async function translateKeys(
  item?: LocaleTreeItem | ProgressSubmenuItem | CommandOptions,
) {
  let source: string | undefined

  if (item && !(item instanceof LocaleTreeItem) && !(item instanceof ProgressSubmenuItem) && item.from) {
    source = item.from
  }
  else {
    const node = getNode(item)

    source = item instanceof ProgressSubmenuItem ? item.sourceLanguage : Config.sourceLanguage
    if (Config.translatePromptSource)
      source = await promptForSourceLocale(source, node, item instanceof ProgressSubmenuItem ? item.locales : item?.loader?.locales || Global.allLocales)

    if (source == null)
      return
  }

  Telemetry.track(TelemetryKey.TranslateKey, { actionSource: Telemetry.getActionSource(item) })

  let nodes: AccaptableTranslateItem[] = []
  let targetLocales: string[] | undefined

  if (item instanceof ProgressSubmenuItem) {
    const to = item.node.locale
    nodes = item.getKeys()
      .map(key => item.loader.getRecordByKey(key, to, true)!)
      .filter(i => i)
  }
  else {
    if (item instanceof LocaleTreeItem)
      targetLocales = item.listedLocales
    else
      targetLocales = item?.locales

    const node = getNodeOrRecord(item)
    if (node)
      nodes.push(node)
  }

  const loader = item instanceof ProgressSubmenuItem ? item.loader : item instanceof LocaleTreeItem ? item.loader : item?.loader || CurrentFile.loader
  await Translator.translateNodes(loader, nodes, source, targetLocales)
}

export async function TranslateKeys(
  item?: LocaleTreeItem | ProgressSubmenuItem | CommandOptions,
) {
  if (item instanceof LocaleTreeItem)
    return await item.withContext(() => translateKeys(item))
  if (item instanceof ProgressSubmenuItem)
    return await item.withProgressContext(() => translateKeys(item))

  return await translateKeys(item)
}
