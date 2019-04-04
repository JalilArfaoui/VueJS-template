<template>
  <div>
    <AdminNav />
    <v-layout id="admin-layout" justify-space-around column>
      <v-toolbar flat color="white">
        <v-toolbar-title>Liste des médias</v-toolbar-title>
        <v-divider
        class="mx-2"
        inset
        vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">Ajouter un média</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm10>
                    <file-input v-model="editedItem.link">
                      <div slot="mediaUpload" class="text-md-center">
                        <v-avatar size="150px" v-ripple v-if="!editedItem.link" class="grey lighten-3 mb-3 btn">
                          <span>Insérer un media audio ou vidéo inférieur à 300MB</span>
                        </v-avatar>
                        <v-avatar size="150px" v-ripple v-else-if="editedItem.link.mediaURL" class="mb-3">
                          <!-- <img :src="editedItem.link.mediaURL" alt="media"> -->
                          <p> {{ editedItem.link.mediaFile.name }} </p>
                        </v-avatar>
                        <v-avatar size="150px" v-ripple v-else class="mb-3">
                          <p> {{ editedItem.link }} </p>
                          <!-- <img :src="editedItem.link" alt="media"> -->
                        </v-avatar>
                      </div>
                    </file-input>
                    <v-text-field
                      v-if=""
                      v-model="editedItem.name"
                      label="Nom">
                    </v-text-field>
                    <v-select
                      v-if=""
                      v-model="editedItem.type"
                      :items="types"
                      item-text="state"
                      item-value="abbr"
                      label="Type de media"
                      persistent-hint
                      return-object
                      single-line
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-alert
                v-if='dialogError'
                :value="dialogError"
                type="error"
                dismissible
                icon="warning"
                color="error"
                outline
                >
                {{dialogError}} Hello
              </v-alert>
            </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
            <v-btn color="blue darken-1" flat :loading="saving" @click="save">Valider</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="medias"
      :pagination.sync="pagination"
      class="elevation-1">
      <template slot="pageText" slot-scope="props" pageStop="20">
        Medias {{ props.pageStart }} à {{ props.pageStop }} sur {{ props.itemsLength }}
      </template>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.link }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.updatedAt}}</td>
        <td class="layout align-center justify-space-around">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
            >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
            >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
    <v-alert
      v-if='error'
      :value="error"
      type="error"
      dismissible
      icon="warning"
      color="error"
      outline
      >
      {{error}}
    </v-alert>
  </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import AdminNav from './AdminNav'
import MediaService from '../services/MediaService'
import mediaUpload from './mediaUpload'
import imageUpload from './imageUpload'

export default {
  components: {
    // Panel,
    AdminNav,
    FileInput: mediaUpload
  },
  data () {
    return {
      // name: this.$store.state.user.name,
      name: '',
      dialog: false,
      error: '',
      dialogError: '',
      medias: [],
      headers: [
        { text: '#', value: 'index' },
        { text: 'Nom', value: 'name' },
        { text: 'Lien', value: 'link' },
        { text: 'Type', value: 'type' },
        { text: 'Date', value: 'updatedAt' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      pagination: {
        rowsPerPage: 25
      },
      editedIndex: -1,
      editedItem: {
        name: '',
        type: '',
        media: null
      },
      defaultItem: {
        name: '',
        type: '',
        media: null
      },
      saving: false,
      saved: false,
      types: ['Audio Guide', 'Audio Coach', 'Enregistrement Audio', 'Enregistrement Video', 'Lecture Audio', 'Lecture Video', 'Photos Exercice', 'Video Coach']
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nouveau media' : 'Modifier le media'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    avatar: {
      handler: function() {
        this.saved = false
      },
      deep: true
    }
  },
  created () {
    this.getMedias()
  },
  mounted () {
    if (localStorage.name) {
      this.name = localStorage.name
    }
    if (localStorage.setUser) {
      this.email = localStorage.setUser
    }
  },
  methods: {
    async getMedias () {
      try {
        const medias = await MediaService.getMedias()
        this.medias = Object.keys(medias.data).map((key) => {
          return medias.data[key]
        })
        this.medias.forEach( media => media.updatedAt = new Date(media.updatedAt).toLocaleDateString("fr-FR"))
      } catch (e) {
        this.error = e.response.data.error
      }
    },

    editItem (item) {
      this.editedIndex = this.medias.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem (item) {
      const index = this.medias.indexOf(item)
      this.editedItem = Object.assign({}, item)
      var conf = confirm('Êtes vous sûr de vouloir supprimer ce media ?')
      if (conf) {
        try {
          const deleted = await MediaService.deleteMedia(this.editedItem._id)
          if (deleted) {
            this.medias.splice(index, 1)
          }
        } catch (e) {
          this.error = e.response.data.error
        }
      }
    },

    close () {
      this.dialog = false
      this.dialogError = ''
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async save () {
      // if (this.editedItem.link != null) {
      if (typeof this.editedItem.link !== 'undefined' && typeof this.editedItem.link.mediaURL !== 'undefined' && this.editedItem.name != "" && this.editedItem.type != "") {
        this.editedItem.link = await this.uploadMedia()
      }
      // } else {
      //   this.mediaUrl = this.editedItem.link
      // }
      if (this.editedIndex > -1) { // Edit media case
        try {
          const edited = await MediaService.editMedia({
            _id: this.editedItem._id,
            name: this.editedItem.name,
            type: this.editedItem.type,
            link: this.editedItem.link
          })
          if (edited) {
            // this.editedItem.link = this.avatarUrl
            Object.assign(this.medias[this.editedIndex], this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (e) {
          this.dialogError = e.response.data
          // this.dialogError = 'Modification non prise en compte. Il est possible que ce nom existe déjà'
        }
      } else { // New media case
        try {
          const res = await MediaService.createMedia({
            name: this.editedItem.name,
            type: this.editedItem.type,
            link: this.editedItem.link
          })
          if (res.data.media) {
            // this.editedItem.link = this.mediaUrl
            this.editedItem.updatedAt = new Date(res.data.media.updatedAt).toLocaleDateString("fr-FR")
            this.medias.push(res.data.media)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (error) {
          // this.dialogError = error.response.data.errors
          this.dialogError = 'Impossible de rajouter ce media. Vérifier que vous avez bien ajouté un media de type audio ou vidéo et que les champs Nom et Type de media sont bien remplis.'
        }
      }
    },
    async uploadMedia() {
      this.saving = true
      try {
        const mediaUrl = await MediaService.mediaUpload(this.editedItem.link.formData)
        this.savedMedia()
        return mediaUrl.data
      } catch (error) {
        this.saving = false
        this.dialogError = error.response.data
        throw error
      }
    },
    savedMedia() {
      this.saving = false
      this.saved = true
    }
  }
}
</script>

<style scoped>
#admin-layout{
  padding-left: calc(350px + 1%);
}
.v-sidebar-menu.collapsed ~ #admin-layout{
  padding-left: calc(50px + 1%);
}
.media{
  border-radius: 30px;
  height: 30px;
  width: 30px;
}
td{
  white-space: pre;
}
.btn{
  cursor: pointer;
}
</style>
