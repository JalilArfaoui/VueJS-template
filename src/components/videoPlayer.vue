<template>
  <!-- <slot name="mediaUpload"></slot> -->
  <div class="video-container">
    <iframe width="640" height="360" v-bind:src="activeVideo" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
</template>

<script>

export default {
  name: 'VideoPlayer',
  props: {
    activeVideo: String
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
