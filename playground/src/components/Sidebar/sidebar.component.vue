<template>
  <div id="app-sidebar">
    <ul class="app-sidebar__items">
      <li
        v-for="item in sidebarItems"
        class="app-sidebar__item"
      >
        <RouterLink :to="item.link"> {{item.name}} </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  sidebarItems: Array,
});
</script>