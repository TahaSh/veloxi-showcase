import {
  ChangedData,
  DragEvent,
  DragEventPlugin,
  Plugin,
  SwipeEvent,
  SwipeEventPlugin,
  View
} from 'veloxi'

export class ChangeCardEvent {
  newIndex: number
  constructor(event: { newIndex: number }) {
    this.newIndex = event.newIndex
  }
}

export class CloseNotesEvent {}

export class CardsSwiperPlugin extends Plugin {
  static pluginName = 'CardsSwiperPlugin'

  container!: View
  cards!: Array<View>
  title!: View
  background!: View
  sidebar!: View
  swipePlugin = this.usePlugin(SwipeEventPlugin)
  dragPlugin = this.usePlugin(DragEventPlugin)
  anchorPosition?: { x: number; y: number }
  previousDragY: number = 0

  setup(): void {
    this.container = this.getView('container')!
    this.cards = this.getViews('card')!
    this.title = this.getView('title')!
    this.background = this.getView('background')!
    this.sidebar = this.getView('sidebar')!
    this.title.position.animator.set('dynamic', { speed: 10 })
    this.title.scale.animator.set('dynamic', { speed: 10 })
    this.cards.forEach((card) => {
      card.position.animator.set('spring')
      card.scale.animator.set('dynamic', { speed: 10 })
      this.swipePlugin.addView(card)
      this.dragPlugin.addView(card)
    })
    this.swipePlugin.addView(this.background)
    this.dragPlugin.addView(this.background)
    this.swipePlugin.on(SwipeEvent, (event) => {
      switch (event.view.name) {
        case 'card':
          this.onCardSwipe(event)
          return
        case 'background':
          this.onBackgroundSwipe(event)
          return
      }
    })
    this.dragPlugin.on(DragEvent, (event) => {
      switch (event.view.name) {
        case 'card':
          this.onCardDrag(event)
          return

        case 'background':
          this.onBackgroundDrag(event)
          return
      }
    })
    this.updateCardsPosition({ isTransitioning: true, animate: false })
    this.updateTitlePosition()
  }

  showNextCard() {
    const newIndex =
      this.currentIndex >= this.cards.length - 1
        ? this.cards.length - 1
        : this.currentIndex + 1
    this.emit(ChangeCardEvent, { newIndex })
  }

  showPreviousCard() {
    const newIndex = this.currentIndex <= 0 ? 0 : this.currentIndex - 1
    this.emit(ChangeCardEvent, { newIndex })
  }

  onCardSwipe(swipe: SwipeEvent) {
    if (this.isClosed) return
    if (swipe.direction === 'up') {
      this.showNextCard()
    }

    if (swipe.direction === 'down') {
      this.showPreviousCard()
    }
  }

  onBackgroundSwipe(swipe: SwipeEvent) {
    if (swipe.direction === 'up') {
      this.emit(CloseNotesEvent, {})
    }
  }

  getDamper(drag: DragEvent): number {
    let damper = 1
    if (!this.anchorPosition) return damper
    const direction = drag.y - this.previousDragY > 0 ? 'down' : 'up'
    if (
      (this.currentIndex === 0 &&
        drag.y > this.anchorPosition.y &&
        direction === 'down') ||
      (this.currentIndex === this.cards.length - 1 &&
        drag.y < this.anchorPosition.y &&
        direction === 'up')
    ) {
      damper = 0.2
    }
    return damper
  }

  onCardDrag(drag: DragEvent) {
    if (this.isClosed) return
    if (drag.isDragging) {
      if (!this.anchorPosition) {
        this.anchorPosition = {
          x: this.currentCard.position.x,
          y: this.currentCard.position.y
        }
      }

      drag.view.position.set({
        y:
          this.anchorPosition.y +
          (drag.y - this.anchorPosition.y) * this.getDamper(drag)
      })

      this.previousDragY = drag.y
    }

    if (!drag.isDragging) {
      this.anchorPosition = undefined
      if (drag.view.position.y < this.scrollY) {
        this.showNextCard()
      } else if (
        drag.view.position.y + drag.view.size.height - this.scrollY >
        window.innerHeight
      ) {
        this.showPreviousCard()
      }
      this.currentCard.position.set({
        y:
          window.innerHeight / 2 -
          this.currentCard.size.height / 2 +
          this.scrollY
      })
    }
  }

  onBackgroundDrag(drag: DragEvent) {
    if (drag.isDragging) {
      const center =
        window.innerHeight / 2 - this.currentCard.size.height / 2 + this.scrollY
      this.currentCard.position.set({
        y: center + drag.height * 0.1
      })
    } else {
      this.currentCard.position.set({
        y:
          window.innerHeight / 2 -
          this.currentCard.size.height / 2 +
          this.scrollY
      })
    }
  }

  updateTitlePosition() {
    if (this.isClosed) {
      this.title.position.reset()
      this.title.scale.setWithSize({
        height: 36
      })
    } else {
      this.title.position.set({
        x: 50,
        y: 60 + this.scrollY
      })
      this.title.scale.reset()
    }
  }

  updateCardsPosition({
    isTransitioning,
    animate
  }: {
    isTransitioning: boolean
    animate: boolean
  }) {
    this.previousCards.forEach((card) => {
      card.styles.opacity = this.isClosed ? '0' : '1'
      card.position.set(
        {
          x: window.innerWidth / 2 - card.size.width / 2,
          y: -card.size.height - 100
        },
        isTransitioning ? false : animate
      )
    })

    this.nextCards.forEach((card) => {
      card.styles.opacity = this.isClosed ? '0' : '1'
      card.position.set(
        {
          x: window.innerWidth / 2 - card.size.width / 2,
          y: window.innerHeight + this.scrollY + 100
        },
        isTransitioning ? false : animate
      )
    })

    this.currentCard.position.animator.set(
      isTransitioning ? 'dynamic' : 'spring'
    )
    this.currentCard.rotation.animator.set('dynamic', { speed: 10 })
    if (this.isClosed) {
      this.currentCard.position.reset(animate)
      this.currentCard.rotation.setDegrees(-5)
      if (this.currentCard.size.width / this.currentCard.size.height >= 1) {
        this.currentCard.scale.setWithSize({ width: 200 }, animate)
      } else {
        this.currentCard.scale.setWithSize({ height: 250 }, animate)
      }
    } else {
      this.currentCard.rotation.reset()
      this.currentCard.scale.reset(animate)
      this.currentCard.position.set(
        {
          x: window.innerWidth / 2 - this.currentCard.size.width / 2,
          y:
            window.innerHeight / 2 -
            this.currentCard.size.height / 2 +
            this.scrollY
        },
        animate
      )
    }
  }

  onDataChanged(data: ChangedData): void {
    if (data.dataName === 'index') {
      this.updateCardsPosition({ isTransitioning: false, animate: true })
    }
    if (data.dataName === 'show') {
      this.background.position.set({
        y: this.scrollY
      })
      this.sidebar.position.set({
        y: this.scrollY + window.innerHeight / 2 - this.sidebar.size.height / 2
      })
      this.updateCardsPosition({ isTransitioning: true, animate: true })
      this.updateTitlePosition()
      if (data.dataValue === 'true') {
        document.body.classList.add('notes-open')
      } else {
        document.body.classList.remove('notes-open')
      }
    }
  }

  get currentIndex() {
    const index = this.container.data.index
    return index ? parseInt(index) : 0
  }

  get currentCard() {
    return this.cards[this.currentIndex]
  }

  get previousCards() {
    return this.cards.slice(0, this.currentIndex)
  }

  get nextCards() {
    return this.cards.slice(this.currentIndex + 1)
  }

  get isClosed() {
    return this.container.data.show === 'false'
  }

  get scrollY() {
    return parseInt(this.background.data.scrollPosition) || 0
  }
}
