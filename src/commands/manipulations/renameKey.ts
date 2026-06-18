import { window, workspace } from 'vscode'
import { overrideConfirm } from '../overrideConfirm'
import { CommandOptions } from './common'
import { LocaleTreeItem } from '~/views'
import { Log, keypathValidate } from '~/utils'
import i18n from '~/i18n'
import { Node, CurrentFile, Global, Telemetry, TelemetryKey, ActionSource, Loader, LocaleLoader } from '~/core'

export async function RenameKey(item?: LocaleTreeItem | string | CommandOptions) {
  if (!item)
    return

  Telemetry.track(TelemetryKey.RenameKey, {
    source: item instanceof LocaleTreeItem
      ? ActionSource.TreeView
      : typeof item !== 'string' && item.actionSource
        ? item.actionSource
        : ActionSource.UiEditor,
  })

  let node: Node | undefined
  let loader: Loader = CurrentFile.loader

  if (typeof item === 'string') {
    node = CurrentFile.loader.getTreeNodeByKey(item)
  }
  else if (item instanceof LocaleTreeItem) {
    node = item.node
    loader = item.loader
  }
  else {
    loader = item.loader || CurrentFile.loader
    node = loader.getTreeNodeByKey(item.keypath)
  }

  if (!node)
    return

  try {
    const oldkeypath = node.keypath
    const newkeypath = await window.showInputBox({
      value: oldkeypath,
      prompt: i18n.t('prompt.enter_new_keypath'),
      ignoreFocusOut: true,
    })

    if (!newkeypath)
      return

    if (!keypathValidate(newkeypath)) {
      window.showWarningMessage(i18n.t('prompt.invalid_keypath'))
      await RenameKey(item)
      return
    }

    if (await overrideConfirm(newkeypath, false, false, loader) !== 'override')
      return

    const renameLoader = loader instanceof LocaleLoader ? loader : Global.loader
    const edit = await renameLoader.renameKey(oldkeypath, newkeypath) // TODO:sfc
    await workspace.applyEdit(edit)

    return newkeypath
  }
  catch (err) {
    Log.error(err)
  }
}
