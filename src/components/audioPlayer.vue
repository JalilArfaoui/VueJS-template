<template>
  <!-- <slot name="mediaUpload"></slot> -->
  <div class="audio-container">
    <!-- <av-circle
      :outline-width="0"
      :progress-width="5"
      :outline-meter-space="5"
      :playtime="true"
      playtime-font="18px Monaco"
      v-bind:audio-src="activeAudio"
    ></av-circle> -->
    <iframe v-bind:src="activeAudio" width="481" frameborder="0" scrolling="no" height="237"></iframe>
  </div>
</template>

<script>
import AudioVisual from 'vue-audio-visual'

export default {
  name: 'AudioPlayer',
  props: {
    activeAudio: String
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
