<template>
  <div
    :class="[
      'welcome-screen',
      !show ? 'welcome-screen--hidden' : '',
      hideNav ? 'welcome-screen--nav-hidden' : ''
    ]"
    data-vel-plugin="WelcomeScreenPlugin"
    data-vel-view="container"
    :data-vel-data-hidden="!show"
  >
    <div class="welcome-screen__background bg-gradient"></div>
    <div
      class="title-section"
      data-vel-plugin="WelcomeScreenPlugin"
      data-vel-view="titleSection"
    >
      <div
        data-vel-plugin="WelcomeScreenPlugin"
        data-vel-view="title"
        class="title"
      >
        Welcome back
      </div>
      <div class="subtitle">What would you like to do?</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: true
  },

  hideNav: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.welcome-screen {
  position: fixed;
  z-index: 40;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  user-select: none;
  padding: 50px 50px;
}

.welcome-screen--hidden {
  pointer-events: none;
}

.welcome-screen--hidden .welcome-screen__background {
  opacity: 0;
}

.welcome-screen__background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  transition: var(--transition-duration) ease opacity;
}

.title-section {
  transform-origin: 0 0;
}

.title {
  font-size: 40px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  transform-origin: left top;
  will-change: transform, opacity;
}

.subtitle {
  font-size: 40px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  transform-origin: left top;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  transition: var(--transition-duration) ease transform;
}

.welcome-screen--nav-hidden .subtitle {
  transform: translate3d(0, -100px, 0);
}
</style>
