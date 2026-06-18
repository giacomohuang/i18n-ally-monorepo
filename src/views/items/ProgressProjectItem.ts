import { ExtensionContext, TreeItemCollapsibleState } from 'vscode'
import { BaseTreeItem } from './Base'
import { ProgressContext } from './ProgressBaseItem'
import { ProgressRootItem } from './ProgressRootItem'
import { Coverage } from '~/core'

export class ProgressProjectItem extends BaseTreeItem {
  collapsibleState = TreeItemCollapsibleState.Expanded

  constructor(
    ctx: ExtensionContext,
    public readonly progressContext: ProgressContext,
    private readonly coverages: Coverage[],
  ) {
    super(ctx)
    this.id = `progress-project-${progressContext.rootContext?.rootpath || 'default'}`
  }

  getLabel() {
    return this.progressContext.rootContext?.project?.name || this.progressContext.rootContext?.rootpath || ''
  }

  // @ts-expect-error
  get description() {
    return this.progressContext.rootContext?.project?.root
  }

  // @ts-expect-error
  get iconPath() {
    return this.getIcon('namespace')
  }

  async getChildren() {
    return this.coverages
      .map(cov => new ProgressRootItem(this.ctx, cov, this.progressContext))
  }
}
