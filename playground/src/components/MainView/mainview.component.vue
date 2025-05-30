<template>
  <div id="app-main" class="app-main__content">
    <!--<RouterView />-->
    <Animation/>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Animation from "@/components/AnimationTest/animation.vue";

export default defineComponent({
  components: { Animation },
})

</script>