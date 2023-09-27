<template>
  <div :class="['notes-container', !show ? 'notes-container--hidden' : '']">
    <div :class="['section__title']">Photos</div>
    <div :class="['section notes-section']">
      <div class="section__card">
        <div class="section__card-text">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
          adipisci hic, nobis repellat repellendus veritatis nesciunt unde
          necessitatibus nemo eligendi iusto ratione doloribus autem! Impedit
          amet corporis autem maxime excepturi.
        </div>
        <div class="section__card-placeholder">
          <div class="psuedo-card">
            <strong>Notes</strong>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
            sunt et, recusandae repellat dicta fugit eum reprehenderit aperiam,
            voluptatum excepturi cum harum sit ad voluptas sint assumenda
            aspernatur doloremque vitae!
          </div>
          <img class="image" src="/public/cover.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  }
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
  margin-top: 10px;
}

.section__card-placeholder {
  width: 200px;
  height: 250px;
  flex-shrink: 0;
}

.section__card-notes {
  width: 200px;
  flex-shrink: 0;
  background: #888;
}

.spacer {
  width: 100%;
  height: 100vh;
}

.notes-container {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
  transition: var(--transition-duration) ease transform;
  transform: translate3d(0, 0, 0);
}

.notes-container--hidden {
  transform: translate3d(0, 10%, 0);
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

.home-screen-drag-handler {
  position: fixed;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

.section__title {
  font-size: 24px;
  font-weight: 500;
  color: #222;
  transition: var(--transition-duration) ease all;
  z-index: 10;
  transform: translate3d(0, 0, 0);
}

.section__title--hidden {
  transform: translate3d(0, 10%, 0);
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

.psuedo-section {
  width: 500px;
  min-height: 400px;
}

.image {
  position: absolute;
  top: 50px;
  right: 15px;
  transform: rotate(-5deg);
  width: 200px;
  border-radius: 5px;
  aspect-ratio: 1;
  object-fit: cover;
}
</style>
