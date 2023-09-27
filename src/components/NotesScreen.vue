<template>
  <div
    data-vel-plugin="CardsSwiperPlugin"
    data-vel-view="background"
    :data-vel-data-scroll-position="scrollPosition"
    :class="[
      'notes-screen-bg bg-gradient',
      !show ? 'notes-screen-bg--hidden' : ''
    ]"
  ></div>
  <div
    :class="['sidebar', !show ? 'sidebar--hidden' : '']"
    data-vel-plugin="CardsSwiperPlugin"
    data-vel-view="sidebar"
  >
    <div
      data-vel-plugin="NotesSidebarPlugin"
      data-vel-view="selector"
      :data-vel-data-index="currentIndex"
      class="sidebar-selector"
    ></div>
    <div class="sidebar-items">
      <div
        v-for="(note, index) in notes"
        :key="note.id"
        :class="[
          'sidebar-item',
          currentIndex === index ? 'sidebar-item--selected' : ''
        ]"
        data-vel-plugin="NotesSidebarPlugin"
        data-vel-view="item"
        @click="$emit('update-current-index', index)"
      >
        <div class="sidebar-item__icon">
          <Component :is="IconComponentMap.get(note.icon)" />
        </div>
        {{ note.title }}
      </div>
    </div>
  </div>
  <div
    class="cards"
    data-vel-plugin="CardsSwiperPlugin"
    data-vel-view="container"
    :data-vel-data-index="currentIndex"
    :data-vel-data-show="show"
    :class="!show ? 'cards--hidden' : ''"
  >
    <div
      v-for="(note, index) in notes"
      :key="note.id"
      :class="['card', currentIndex === index ? 'card--current' : '']"
      data-vel-plugin="CardsSwiperPlugin"
      data-vel-view="card"
      @click="$emit('card-click')"
    >
      <div class="card__header">
        <div class="card__header-date">{{ note.date }}</div>
        <div class="card__header-container">
          <div class="card__header-icon">
            <Component :is="IconComponentMap.get(note.icon)" />
          </div>
          <div class="card__header-title">{{ note.title }}</div>
        </div>
      </div>
      <div class="card__body" v-html="note.contentHtml"></div>
      <div class="card__bottom-bar">
        <div class="card__bottom-bar-item">
          <div class="card__bottom-bar-item-icon">
            <IconDelete />
          </div>
          <div class="card__bottom-bar-item-title">Delete</div>
        </div>
        <div class="card__bottom-bar-item">
          <div
            class="card__bottom-bar-item-icon card__bottom-bar-item-share-icon"
          >
            <IconShare />
          </div>
          <div class="card__bottom-bar-item-title">Share</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconShare from './IconShare.vue'
import IconDelete from './IconDelete.vue'
import IconNotes from './IconNotes.vue'
import IconApple from './IconApple.vue'
import IconInvoice from './IconInvoice.vue'
import IconStar from './IconStar.vue'
import { notes as notesData } from '../notes'
import { ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },

  currentIndex: {
    type: Number,
    required: true
  },

  scrollPosition: {
    type: Number,
    default: 0
  }
})

defineEmits(['update-current-index', 'card-click'])

const IconComponentMap = new Map()
IconComponentMap.set('IconStar', IconStar)
IconComponentMap.set('IconInvoice', IconInvoice)
IconComponentMap.set('IconApple', IconApple)
IconComponentMap.set('IconNotes', IconNotes)

const notes = ref(notesData)
</script>

<style scoped>
.notes-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 21;
  will-change: opacity;
  transition: var(--transition-duration) ease opacity;
}

.notes-screen--hidden {
  opacity: 0;
  pointer-events: none;
}

.page-title {
  position: fixed;
  top: 60px;
  left: 50px;
  font-size: 120px;
  font-weight: 400;
  color: hsl(203.6, 15.6%, 63.3%);
}

.sidebar {
  --sidebar-item-height: 44px;
  position: fixed;
  z-index: 21;
  left: 50px;
  top: 400px;
  width: 250px;
  display: flex;
  flex-direction: column;
  will-change: opacity;
  transition: var(--transition-duration) ease opacity;
}

.sidebar--hidden {
  opacity: 0;
  pointer-events: none;
}

.sidebar-items {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px 0;
}

.sidebar-item {
  width: 100%;
  color: hsl(203.6, 15.6%, 35%);
  height: var(--sidebar-item-height);
  opacity: 0.25;
  font-weight: 600;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 0 10px;
  filter: grayscale(100%) brightness(0.6);
  cursor: pointer;
  user-select: none;

  transition-property: opacity, filter;
  transition-duration: 0.4s;
  transition-timing-function: ease;
}

.sidebar-item--selected {
  cursor: default;
  filter: grayscale(0);
  opacity: 1;
}

.sidebar-selector {
  border-radius: 6px;
  width: 100%;
  height: var(--sidebar-item-height);
  background: rgba(255, 255, 255, 0.5);
}

.sidebar-item__icon {
  display: flex;
  width: 20px;
  height: 20px;
}
.cards {
  display: flex;
  flex-direction: column;
  height: 100vh;
  z-index: 30;
  position: absolute;
  left: 270px;
  top: 60px;
}

.cards--hidden {
  pointer-events: none;
}

.card {
  width: 500px;
  max-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  background: whitesmoke;
  color: #737373;
  font-size: 20px;
  font-weight: 400;
  border-radius: 10px;
  box-shadow: 0 25px 50px -12px hsla(203.3, 10%, 40%, 0.25);
  touch-action: none;
  user-select: none;
  will-change: transform;
  transform-origin: 0 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px 40px;
  position: absolute;
}

/* .card:nth-child(2) {
  aspect-ratio: 0.9;
}

.card:nth-child(4) {
  aspect-ratio: 0.62;
} */

.card__body {
  flex: 1;
  font-size: 14px;

  display: flex;
  flex-direction: column;
}

.card__body p {
  margin-bottom: 0;
}

.card__body ul {
  margin: 0;
  padding: 0;
  list-style-position: inside;
  margin-top: 10px;
}

.card__body h2 {
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 0;
  color: #666;
}

.card__header {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.card__header-container {
  display: flex;
  align-items: center;
}

.card__header-icon {
  width: 32px;
  filter: grayscale(100%);
  opacity: 0.5;
  line-height: 1;
  margin-right: 8px;
  position: absolute;
  top: 45px;
  right: 29px;
}

.card:nth-child(4) .card__header-icon {
  filter: grayscale(100%) brightness(0.8);
}

.card__header-date {
  font-size: 11px;
  font-weight: 600;
  color: #888;
}

.card__header-title {
  line-height: 1.3;
  margin-bottom: 5px;
  font-size: 28px;
  color: #444;
  font-weight: 700;
}

.card__bottom-bar {
  display: flex;
  gap: 0 20px;
  padding: 5px 0 10px;
}

.card__bottom-bar-item {
  display: flex;
  align-items: center;
  color: #999;
}

.card__bottom-bar-item-title {
  line-height: 1;
  font-size: 14px;
  font-weight: 600;
}

.card__bottom-bar-item-icon {
  width: 18px;
  height: 18px;
  display: flex;
}

.card__bottom-bar-item-icon.card__bottom-bar-item-share-icon {
  width: 16px;
  height: 16px;
  margin-right: 2px;
}

.notes-screen-bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  will-change: opacity;
  transition: var(--transition-duration) ease opacity;
}

.notes-screen-bg--hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
