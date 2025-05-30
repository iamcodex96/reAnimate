<template>
  <div>
    <div ref="element" class="animated-element"></div>
    <div class="controls">
      <button @click="play">Play</button>
      <button @click="pause">Pause</button>
      <button @click="restart">Restart</button>
      <div class="progress">{{ progressText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { Timeline, Animation, easings } from '@re-code/animate';

export default defineComponent({
  props: {
    duration: { type: Number, default: 1000 },
    easing: { type: String, default: 'easeInOutQuad' }
  },
  
  setup(props) {
    const element = ref<HTMLElement | null>(null);
    const progress = ref(0);
    const progressText = computed(() => `${Math.floor(progress.value * 100)}%`);
    
    let animation: Animation | null = null;
    let subscription: any = null;
    
    onMounted(() => {
      if (!element.value) return;
      element.value.style.transform = 'translateX(0px)';
      element.value.style.opacity = '0';

      // Create the animation
      animation = new Animation({
        target: element.value,
        properties: {
          transform: ['translateX(0px)', 'translateX(200px)'],
          opacity: [0, 1]
        },
        options: {
          duration: props.duration,
          easing: easings()[props.easing as keyof ReturnType<typeof easings>]
        }
      });
      
      // Subscribe to progress updates
      subscription = animation.progress().subscribe(value => {
        progress.value = value;
      });
    });
    
    onUnmounted(() => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    
    const play = () => animation?.play();
    const pause = () => animation?.pause();
    const restart = () => {
      animation?.seek(0);
      animation?.play();
    };
    
    return {
      element,
      progress,
      progressText,
      play,
      pause,
      restart
    };
  }
});
</script>

<style scoped>
.animated-element {
  width: 50px;
  height: 50px;
  background-color: #3498db;
  border-radius: 4px;
}

.controls {
  margin-top: 20px;
}

button {
  margin-right: 10px;
  padding: 8px 16px;
}

.progress {
  margin-top: 10px;
  font-weight: bold;
}
</style>