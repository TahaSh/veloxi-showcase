<template>
  <HomeNavBar
    :show="currentScreen === 'HomeScreen'"
    :homeScrolled="homeScrolled"
  />

  <WelcomeScreen
    :show="currentScreen === 'WelcomeScreen'"
    :hideNav="currentScreen === 'NotesScreen'"
  />

  <div
    class="home-screen"
    data-vel-plugin="HomeScreenPlugin"
    data-vel-view="root"
    :data-vel-data-closable="currentScreen === 'HomeScreen'"
  >
    <div class="notes-container">
      <div
        data-vel-plugin="CardsSwiperPlugin"
        data-vel-view="title"
        class="section__title"
      >
        NOTES
      </div>
      <div
        :class="[
          'section notes-section',
          currentScreen !== 'HomeScreen' ? 'section--hidden' : ''
        ]"
      >
        <div class="section__card" @click="currentScreen = 'NotesScreen'">
          <div class="section__card-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
            adipisci hic, nobis repellat repellendus veritatis nesciunt unde
            necessitatibus nemo eligendi iusto ratione doloribus autem! Impedit
            amet corporis autem maxime excepturi.
          </div>
          <div
            data-vel-plugin="CardsSwiperPlugin"
            data-vel-view="cardPlaceholder"
            class="section__card-placeholder"
          >
            <div class="psuedo-card">
              <strong>Notes</strong>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              sunt et, recusandae repellat dicta fugit eum reprehenderit
              aperiam, voluptatum excepturi cum harum sit ad voluptas sint
              assumenda aspernatur doloremque vitae!
            </div>
          </div>
        </div>
      </div>
      <NotesScreen
        :show="currentScreen === 'NotesScreen'"
        :currentIndex="currentIndex"
        :scrollPosition="scrollPosition"
        @card-click="currentScreen = 'NotesScreen'"
        @update-current-index="(index: number) => (currentIndex = index)"
      />
    </div>

    <PsuedoSection :show="currentScreen === 'HomeScreen'" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PsuedoSection from './components/PsuedoSection.vue'
import HomeNavBar from './components/HomeNavBar.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'
import NotesScreen from './components/NotesScreen.vue'

import { App } from 'veloxi'
import {
  CloseWelcomeScreenEvent,
  WelcomeScreenPlugin
} from './plugins/WelcomeScreenPlugin'
import {
  HomeScreenPlugin,
  CloseHomeScreenEvent
} from './plugins/HomeScreenPlugin'

import {
  CardsSwiperPlugin,
  ChangeCardEvent,
  CloseNotesEvent
} from './plugins/CardsSwiperPlugin'
import { NotesSidebarPlugin } from './plugins/NotesSidebarPlugin'

export type Screen = 'HomeScreen' | 'WelcomeScreen' | 'NotesScreen'

const currentScreen = ref<Screen>('WelcomeScreen')
const homeScrolled = ref(false)
const scrollPosition = ref(0)

const currentIndex = ref(0)

const app = App.create()

onMounted(() => {
  app.addPlugin(WelcomeScreenPlugin)
  app.addPlugin(CardsSwiperPlugin)
  app.addPlugin(NotesSidebarPlugin)
  app.addPlugin(HomeScreenPlugin)

  app.run()

  app.onPluginEvent(WelcomeScreenPlugin, CloseWelcomeScreenEvent, () => {
    currentScreen.value = 'HomeScreen'
  })

  app.onPluginEvent(HomeScreenPlugin, CloseHomeScreenEvent, () => {
    currentScreen.value = 'WelcomeScreen'
  })

  app.onPluginEvent(CardsSwiperPlugin, ChangeCardEvent, ({ newIndex }) => {
    currentIndex.value = newIndex
  })

  app.onPluginEvent(CardsSwiperPlugin, CloseNotesEvent, () => {
    currentScreen.value = 'HomeScreen'
  })

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      currentScreen.value = 'HomeScreen'
    }
  })

  const home = document.querySelector<HTMLElement>('.home-screen')!
  home.addEventListener('scroll', () => {
    homeScrolled.value = home.scrollTop > 0
    scrollPosition.value = home.scrollTop
  })
})
</script>

<style scoped>
.section {
  transition: var(--transition-duration) ease transform;
  transform: translate3d(0, 0, 0);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 10;
}

.section--hidden {
  transform: translate3d(0, 10%, 0);
}

.section__card {
  background: rgba(255, 255, 255, 0.2);
  max-width: 500px;
  border-radius: 10px;
  color: #444;
  padding: 30px;
  display: flex;
  gap: 0 20px;
  margin-top: 20px;
}

.section__card-placeholder {
  width: 200px;
  height: 250px;
  flex-shrink: 0;
}

.notes-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
}

.home-screen {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  padding: 100px 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  user-select: none;
  -webkit-user-select: none;
  gap: 50px 0;
}

.section__title {
  font-size: 120px;
  font-weight: 500;
  color: #222;
  transition: var(--transition-duration) ease color;
  z-index: 30;
  position: absolute;
  top: -25px;
  transform-origin: 0 0;
}

body.notes-open .section__title {
  color: hsl(203.6, 15.6%, 63.3%);
}

.psuedo-card {
  width: 200px;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 14px;
  aspect-ratio: 1;
  background: whitesmoke;
  color: #737373;
  font-size: 10px;
  font-weight: 400;
  border-radius: 4px;
  box-shadow: 0 25px 50px -12px hsla(203.3, 10%, 40%, 0.25);
  transform: translate3d(20px, 0, 0) rotate(2deg);
  gap: 5px 0;
}
</style>
