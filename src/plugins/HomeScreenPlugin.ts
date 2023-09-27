import { DragEvent, DragEventPlugin, Plugin, View } from 'veloxi'

export class CloseHomeScreenEvent {}

export class HomeScreenPlugin extends Plugin {
  static pluginName = 'HomeScreenPlugin'

  dragPlugin = this.usePlugin(DragEventPlugin)
  root!: View

  setup(): void {
    this.root = this.getView('root')!
    this.dragPlugin.addView(this.root)

    this.dragPlugin.on(DragEvent, this.onDrag.bind(this))
  }

  onDrag(drag: DragEvent) {
    if (
      this.root.data.closable === 'true' &&
      drag.isDragging &&
      this.root.element.scrollTop <= 0 &&
      drag.height > 10
    ) {
      this.emit(CloseHomeScreenEvent, {})
    }
  }
}
