<template>
  <div id="app-main" class="app-main__content">
    <!--<RouterView />-->
    <PresetsDemo/>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Animation from "@/components/AnimationTest/animation.vue";
import PresetsDemo from "@/components/PresetsDemo/PresetsDemo.vue";

export default defineComponent({
  components: { PresetsDemo, Animation },
})

</script>