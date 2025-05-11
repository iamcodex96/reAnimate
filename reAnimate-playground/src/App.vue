<template>
  <div class="box" ref="box"></div>
</template>

<script>
import * as animations from '@re-code/animate';

export default {
  name: 'App',
  mounted() {
    console.log(animations);

  },
};
</script>

<style>
.box {
  width: 50px;
  height: 50px;
  background-color: red;
  position: relative;
}
</style>
