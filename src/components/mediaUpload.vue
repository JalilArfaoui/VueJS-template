<template> <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-media-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
  <div>
    <div @click="launchFilePicker()">
      <slot name="mediaUpload"></slot>
    </div>
    <input type="file"
       ref="file"
       :name="uploadFieldName"
       @change="onFileChange(
          $event.target.name, $event.target.files)"
       style="display:none">

       <!-- error dialog displays any potential errors -->
    <v-dialog v-model="errorDialog" max-width="300">
      <v-card>
        <v-card-text class="subheading">{{errorText}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="errorDialog = false" flat>Okay !</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    name: 'file-input',
    data: ()=> ({
      errorDialog: null,
      errorText: '',
      uploadFieldName: 'file',
      maxSize: 300000
    }),
    props: {
      // Use "value" here to enable compatibility with v-model
      value: Object,
    },
    methods: {
      launchFilePicker(){
        this.$refs.file.click();
      },
      onFileChange(fieldName, file) {
        const { maxSize } = this
        let mediaFile = file[0]

        //check if user actually selected a file
        if (file.length>0) {
          let size = mediaFile.size / maxSize / maxSize
          if (!mediaFile.type.match('audio/*') && !mediaFile.type.match('video/*')) {
            // check whether the upload is an media
            this.errorDialog = true
            this.errorText = 'Ce fichier n\'est pas un media'
          } else if (size>1) {
            // check whether the size is greater than the size limit
            this.errorDialog = true
            this.errorText = 'Fichier trop volumineux, choisir un fichier inférieur à 300MB'
          } else {
            // Append file into FormData & turn file into media URL
            let formData = new FormData()
            let mediaURL = URL.createObjectURL(mediaFile)
            // formData.append(fieldName, mediaFile)
            formData.append('media', mediaFile)
            // Emit FormData & media URL to the parent component
            this.$emit('input', { formData, mediaURL , mediaFile})
          }
        }
      }
    }
  }
</script>
