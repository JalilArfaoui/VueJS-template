<template> <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
  <div>
    <div @click="launchFilePicker()">
      <slot name="imageUpload"></slot>
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
    name: 'image-input',
    data: ()=> ({
      errorDialog: null,
      errorText: '',
      uploadFieldName: 'file',
      maxSize: 1024
    }),
    props: {
      // Use "value" here to enable compatibility with v-model
      value: String,
    },
    methods: {
      launchFilePicker(){
        this.$refs.file.click();
      },
      onFileChange(fieldName, file) {
        console.log('FieldName: ' + fieldName);
        console.log('File: ' + file);
        const { maxSize } = this
        let imageFile = file[0]
        console.log(imageFile);

        //check if user actually selected a file
        if (file.length>0) {
          let size = imageFile.size / maxSize / maxSize
          if (!imageFile.type.match('image.*')) {
            // check whether the upload is an image
            this.errorDialog = true
            this.errorText = 'Ce fichier n\'est pas une image'
          } else if (size>1) {
            // check whether the size is greater than the size limit
            this.errorDialog = true
            this.errorText = 'Fichier trop volumineux, choisir un fichier inférieur à 1MB'
          } else {
            // Append file into FormData & turn file into image URL
            let formData = new FormData()
            let imageURL = URL.createObjectURL(imageFile)
            // formData.append(fieldName, imageFile)
            formData.append('image', imageFile)
            // Emit FormData & image URL to the parent component
            this.$emit('input', { formData, imageURL })
          }
        }
      }
    }
  }
</script>
