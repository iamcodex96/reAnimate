<template>
  <div :class="`app-${isThemeLight ? 'light' : 'dark'}`">
    <Navbar
        :is-theme-light="isThemeLight"
        @on-theme-change="onThemeChange"
    />
    <Sidebar/>
    <MainView/>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import MainView from './components/MainView/mainview.component.vue';
import Sidebar from './components/Sidebar/sidebar.component.vue';
import Navbar from './components/Navbar/navbar.component.vue';

const isThemeLight = ref(true);
function onThemeChange(selectedTheme) {
  isThemeLight.value = selectedTheme;
}
</script>

<style>
@forward 'playground/src/styles/main.scss';
</style>