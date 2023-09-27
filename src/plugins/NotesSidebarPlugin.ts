import { EventBus, DataChangedEvent, Plugin, View } from 'veloxi'

export class NotesSidebarPlugin extends Plugin {
  static pluginName = 'NotesSidebarPlugin'

  selector!: View
  items!: Array<View>

  get currentIndex() {
    return this.selector.data.index ? parseInt(this.selector.data.index) : 0
  }

  get selectedItem() {
    return this.items[this.currentIndex]
  }

  setup(): void {
    this.selector = this.getView('selector')!
    this.selector.position.setAnimator('spring')
    this.items = this.getViews('item')!
    this.updateSelectorPosition(false)
  }

  updateSelectorPosition(animate = true) {
    this.selector.position.set(
      {
        x: this.selectedItem.position.x,
        y: this.selectedItem.position.y
      },
      animate
    )
  }

  subscribeToEvents(eventBus: EventBus): void {
    eventBus.subscribeToEvent(DataChangedEvent, ({ pluginName }) => {
      if (pluginName === this.pluginName) {
        this.updateSelectorPosition()
      }
    })
  }
}
