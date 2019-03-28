<template>
  <div class="video-container">
    Id de la video : {{_videoID}} </br>
    Nom de la vidéo: {{media.name}}</br>
    Lien de la vidéo: <a :href="media.link">{{media.link}}</a></br>
    <!-- <iframe width="640" height="360" v-bind:src="media.link" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> -->
  </div>
</template>

<script>
import MediaService from '../services/MediaService'

export default {
  name: 'videoPlayer',
  props: {
    _videoID: String
    // activeVideo: String
  },
  data () {
    return {
      media: ''
    }
  },
  created () {
    this.getMediaById()
  },
  methods: {
    async getMediaById () {
      try {
        const mediaTmp = await MediaService.getMediaById({
          _mediaId: this._videoID
        })
        this.media = mediaTmp.data.media
      } catch (e) {
        this.error = e.response
      }
    }
  }
}
</script>

<style scoped>
</style>
