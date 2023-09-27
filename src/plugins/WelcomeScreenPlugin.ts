import {
  ChangedData,
  DragEvent,
  DragEventPlugin,
  Plugin,
  Utils,
  View
} from 'veloxi'

export class CloseWelcomeScreenEvent {}

const targetScale = 0.5
const subtitleOffset = 10

export class WelcomeScreenPlugin extends Plugin {
  static pluginName = 'WelcomeScreenPlugin'

  container!: View
  title!: View
  subtitle!: View
  titleSection!: View

  dragPlugin = this.usePlugin(DragEventPlugin)
  progress: number = 0
  targetY: number = 0
  locked = false

  setup(): void {
    this.container = this.getView('container')!
    this.title = this.getView('title')!
    this.subtitle = this.getView('subtitle')!
    this.titleSection = this.getView('titleSection')!
    this.targetY = -(this.title.size.height * targetScale) + subtitleOffset

    this.titleSection.position.animator.set('dynamic', { speed: 10 })
    this.titleSection.scale.animator.set('dynamic', { speed: 10 })
    this.titleSection.position.animator.onUpdate(
      this.onTextSectionPositionUpdate.bind(this)
    )

    this.dragPlugin.addView(this.container)

    this.dragPlugin.on(DragEvent, this.onDrag.bind(this))

    this.updateBodyClasses()
    window.scrollTo(0, 0)
  }

  onDrag(event: DragEvent) {
    if (this.isClosed) return
    if (event.isDragging) {
      const isDown =
        this.titleSection.position.y > this.titleSection.position.initialY
      const DAMPING = isDown ? 0.2 : 0.2

      const velocityY = event.y - event.previousY
      const movingUp = velocityY < 0

      const remaining =
        Math.abs(this.targetY - this.titleSection.position.y) * 0.5
      if (movingUp && Math.abs(velocityY) >= remaining) {
        this.titleSection.position.set({
          y: this.targetY
        })
        this.locked = true
        this.hideScreen()
        return
      }

      if (this.locked) return

      this.titleSection.position.set(
        {
          y: Math.max(
            this.targetY,
            this.titleSection.position.initialY + event.height * DAMPING
          )
        },
        false
      )
      this.onTextSectionPositionUpdate()
    } else {
      if (!this.locked) {
        this.titleSection.position.reset()
      }
      this.locked = false
    }
  }

  onTextSectionPositionUpdate() {
    this.progress = this.titleSection.position.progressTo({
      y: this.targetY
    })
    const titleOpacity = Utils.valueAtPercentage(1, 0, this.progress)
    this.title.styles.opacity = String(titleOpacity)

    const initialScale = 1
    const scale = Utils.valueAtPercentage(
      initialScale,
      targetScale,
      this.progress
    )
    this.titleSection.scale.set({
      x: scale,
      y: scale
    })
  }

  onDataChanged(data: ChangedData): void {
    if (data.dataName === 'hidden' && data.dataValue === 'false') {
      this.locked = false
      this.titleSection.position.reset()
    }
    this.updateBodyClasses()
  }

  updateBodyClasses() {
    if (this.isClosed) {
      document.body.classList.remove('welcome-open')
    } else {
      document.body.classList.add('welcome-open')
    }
  }

  hideScreen() {
    this.emit(CloseWelcomeScreenEvent, {})
  }

  get isClosed() {
    return this.container.data.hidden === 'true'
  }
}
