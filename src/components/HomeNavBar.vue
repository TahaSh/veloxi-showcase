<template>
  <div
    :class="[
      'navbar',
      !show ? 'navbar--hidden' : '',
      homeScrolled ? 'navbar--blurred' : ''
    ]"
  ></div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: true
  },

  homeScrolled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.navbar {
  position: fixed;
  z-index: 39;
  top: 0;
  left: 0;
  height: 50px;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  transition: var(--transition-duration) ease transform;
  transform: translate3d(0, 0, 0);
}
.navbar--blurred {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.navbar--hidden {
  transform: translate3d(0, -100%, 0);
}
</style>
