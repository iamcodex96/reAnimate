<template>
  <div class="presets-demo">
    <h1>Animation Presets</h1>

    <div class="controls">
      <label>
        Duration: {{ duration }}ms
        <input type="range" min="100" max="2000" step="100" v-model.number="duration">
      </label>

      <label>
        Easing:
        <select v-model="selectedEasing">
          <option v-for="(_, name) in easings" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>

      <label>
        Intensity:
        <input type="range" min="0.1" max="3" step="0.1" v-model.number="intensity">
        {{ intensity.toFixed(1) }}
      </label>
    </div>

    <div class="presets-grid">
      <div
          v-for="(presetName, key) in presetsList"
          :key="key"
          class="preset-card"
      >
        <h3>{{ formatPresetName(key) }}</h3>
        <div class="animation-box">
          <div
              ref="animationTargets"
              class="animation-target"
              @click="playAnimation(key, $event.target)"
          >
            Click to Play
          </div>
        </div>
        <button @click="playAnimation(key, $refs.animationTargets[presetIndex(key)])">
          Play {{ formatPresetName(key) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import animate, { PRESETS, easings } from '@re-code/animate';

// Animation settings
const duration = ref(800);
const selectedEasing = ref('easeOutQuint');
const intensity = ref(1);

// Create a mapping of preset keys to their actual values
const presetsList = PRESETS;

// Helper to get the index of a preset in the list
const presetIndex = (key: string) => {
  return Object.keys(presetsList).indexOf(key);
};

// Format preset name for display (e.g., FADE_IN -> Fade In)
const formatPresetName = (name: string) => {
  return name
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Play the selected animation
const playAnimation = (presetKey: string, target: HTMLElement) => {
  if (!target) return;

  // Get the animation preset name from the PRESETS object
  const presetName = presetKey as keyof typeof PRESETS;

  // Create the animation with current settings
  animate.preset(presetName, target, {
    duration: duration.value,
    easing: easings()[selectedEasing.value],
    intensity: intensity.value,
    autoplay: true
  });
};
</script>

<style scoped>
.presets-demo {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.controls label {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.controls input, .controls select {
  margin-top: 5px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.preset-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.preset-card h3 {
  margin-top: 0;
  text-align: center;
}

.animation-box {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 15px;
}

.animation-target {
  width: 100px;
  height: 100px;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  user-select: none;
  font-size: 14px;
}

button {
  padding: 8px 12px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3498db;
}
</style>