<template>
  <nav id="app-navbar" class="navbar">
    <RouterLink id="app-logo" class="logo" src="/">
      RE; Animate
    </RouterLink>
    <div id="theme-toggle">
      <label class="switch">
        <input type="checkbox" :checked="isThemeLight" @change="onThemeChange">
        <span class="slider round"></span>
      </label>
      <img id="theme-icon" src="@/assets/night-mode.svg" alt="theme icon">
    </div>
  </nav>
</template>
<style lang="scss">
@forward './navbar.scss';
</style>
<script setup>
  defineProps({
    isThemeLight: Boolean,
  })
  const emit = defineEmits(['on-theme-change']);

  function onThemeChange(event) {
    emit('on-theme-change', event.target.checked);
  }
</script>