<template>
  <v-layout justify-center>
    <v-flex lg6>
      <panel title="Enregistrer">
        <slot>
          <div class="camera-modal">
            <video ref="video" class="camera-stream" muted/>
            <div class="camera-modal-container">
              <a
                v-show="!recording"
                @click="record">
                <i class="material-icons">play_circle_outline</i>
              </a>
              <a
                v-show="recording"
                @click="stop">
                <i class="material-icons">pause_circle_outline</i>
              </a>
              <a
                @click="capture">
                <i class="material-icons">camera</i>
              </a>
              <a
                v-show="mediaStream"
                @click="destroy">
                <i class="material-icons">videocam_off</i>
              </a>
              <a
                v-show="!mediaStream"
                @click="launch">
                <i class="material-icons">videocam</i>
              </a>
                <!-- <span @click="capture" class="take-picture-button take-picture-button mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i class="material-icons">camera</i>
                </span> -->
                <!-- <span @click="destroyedroy" class="take-picture-button take-picture-button mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                  <i class="material-icons">close</i>
                </span> -->
            </div>
          </div>
        </slot>
      </panel>
    </v-flex>
    <v-flex xs6 v-show="recorded">
      <panel title="Visionner">
        <slot>
          <video id="recording" controls></video><br />
          <a id="download" @click="download"><i class="material-icons">download</i></a>
        </slot>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
// import Panel from '@/components/Panel'
// import AuthenticationService from '@/services/AuthenticationService'
// import EmailService from '@/services/EmailService'
// const _ = require('lodash')
// const Joi = require('joi')

export default {
  components: {
    // Panel
  },
  data () {
    return {
      valid: false,
      email: '',
      name: '',
      error: '',
      mediaStream: null,
      recording: false,
      recorded: false,
      mediaRecorder: null,
      recordedChunks: []
    }
  },
  mounted () {
    this.launch()
  },
  destroyed () {
    this.destroy()
  },
  methods: {
    launch () {
      var constraints = { audio: true, video: true }
      navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream => {
          this.mediaStream = mediaStream
          this.$refs.video.srcObject = mediaStream
          this.$refs.video.play()
        })
        .catch(error => console.error('getUserMedia() error:', error))
    },
    record () {
      this.mediaRecorder = new MediaRecorder(this.mediaStream)

      this.mediaRecorder.addEventListener('dataavailable', this.onRecordingReady)
      this.mediaRecorder.ondataavailable = this.handleDataAvailable

      this.mediaRecorder.start()
      // console.log(this.mediaRecorder.state)
      // console.log('recorder started')
      this.recording = true
      // record.style.background = "red"
      // record.style.color = "black"
    },
    stop () {
      this.mediaRecorder.stop()
      // console.log(this.mediaRecorder.state)
      this.recording = false
      // console.log('recorder stopped')
      // record.style.background = ""
      // record.style.color = ""
    },
    onRecordingReady (e) {
      var video = document.getElementById('recording')
      // e.data contains a blob representing the recording
      video.src = URL.createObjectURL(e.data)
      this.recorded = true
      // video.play()
    },
    handleDataAvailable (event) {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data)
      }
    },
    // play() {
    //   var superBuffer = new Blob(recordedChunks)
    //   videoElement.src = window.URL.createObjectURL(superBuffer)
    //   recordedVideo.play();
    // },
    download (e) {
      const blob = new Blob(this.recordedChunks, {type: 'video/webm'})
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'test.webm'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
    },
    capture () {
      const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
      const imageCapture = new window.ImageCapture(mediaStreamTrack)
      return imageCapture.takePhoto().then(blob => {
        console.log(blob)
      })
    },
    destroy () {
      const tracks = this.mediaStream.getTracks()
      tracks.map(track => track.stop())
      this.mediaStream = null
    }
  }
}
</script>

<style scoped>
  .camera-modal {
    /* width: 80vw; */
    /* height: 80vh; */
    /* top: 0; */
    /* left: 0; */
    position: relative;
    background-color: white;
    z-index: 10;
  }
  .camera-stream {
    width: 100%;
    max-height: 100%;
  }
  .camera-modal-container {
    /* position: absolute;
    bottom: 0; */
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }
  .take-picture-button {
      display: flex;
  }
</style>
