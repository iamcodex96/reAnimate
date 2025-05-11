<template>
  <div class="box" ref="box"></div>
</template>

<script>
import { animate, easings } from '@re-code/animate';

export default {
  name: 'App',
  mounted() {
    const box = this.$refs.box;

    const config = {
      from: 0,
      to: 300,
      duration: 2000,
      easing: easings().easeOutQuad,
    };

    animate(config).subscribe({
      next: (state) => {
        box.style.transform = `translateX(${state.value}px)`; // Move the box
      },
      complete: () => {
        console.log('Animation complete!');
      },
    });
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
