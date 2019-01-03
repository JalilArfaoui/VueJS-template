<template>
  <div>
    <AdminNav />
    <v-layout id="admin-layout" justify-space-around column>
      <v-toolbar flat color="white">
        <v-toolbar-title>Liste des coachs</v-toolbar-title>
        <v-divider
        class="mx-2"
        inset
        vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">Ajouter un coach</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm10>
                    <image-input v-model="editedItem.avatar">
                      <div slot="imageUpload" class="text-md-center">
                        <v-avatar size="150px" v-ripple v-if="!editedItem.profilPicture" class="grey lighten-3 mb-3 btn">
                          <span>Insérer une photo carré inférieure à 1MB</span>
                        </v-avatar>
                        <v-avatar size="150px" v-ripple v-else class="mb-3">
                          <img :src="editedItem.profilPicture" alt="avatar">
                        </v-avatar>
                      </div>
                    </image-input>
                    <v-text-field
                      v-if=""
                      v-model="editedItem.firstName"
                      label="Prénom">
                    </v-text-field>
                    <v-text-field
                      v-if=""
                      v-model="editedItem.lastName"
                      label="Nom">
                    </v-text-field>
                    <v-text-field
                      v-if=""
                      v-model="editedItem.email"
                      label="E-mail">
                    </v-text-field>
                    <v-textarea
                      v-if=""
                      v-model="editedItem.description"
                      label="Description"
                      counter="500"
                      flat
                      multi-line>
                    </v-textarea>
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
                {{dialogError}}
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
      :items="coachs"
      :pagination.sync="pagination"
      class="elevation-1">
      <template slot="pageText" slot-scope="props" pageStop="20">
        Coachs {{ props.pageStart }} à {{ props.pageStop }} sur {{ props.itemsLength }}
      </template>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td><img :src="props.item.profilPicture" class="profilPicture"></td>
        <td>{{ props.item.firstName }}</td>
        <td>{{ props.item.lastName }}</td>
        <td>{{ props.item.email }}</td>
        <td>{{ props.item.description.substring(0,40) + '...' }}</td>
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
import AdminService from '../services/AdminService'
import imageUpload from './imageUpload'

export default {
  components: {
    // Panel,
    AdminNav,
    ImageInput: imageUpload
  },
  data () {
    return {
      name: this.$store.state.user.name,
      dialog: false,
      error: '',
      dialogError: '',
      coachs: [],
      headers: [
        { text: '#', value: 'index' },
        { text: 'Profil', value: 'profilPicture' },
        { text: 'Prénom', value: 'firstName' },
        { text: 'Nom', value: 'lastName' },
        { text: 'E-mail', value: 'email' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      pagination: {
        rowsPerPage: 25
      },
      editedIndex: -1,
      editedItem: {
        firstName: '',
        lastName: '',
        email: '',
        description: '',
        profilPicture: null
      },
      defaultItem: {
        firstName: '',
        lastName: '',
        email: '',
        description: '',
        profilPicture: null
      },
      avatarUrl: null,
      saving: false,
      saved: false
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nouveau coach' : 'Modifier le coach'
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
    this.getCoachs()
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
    async getCoachs () {
      try {
        const coachs = await AdminService.getCoachs()
        this.coachs = Object.keys(coachs.data).map((key) => {
          return coachs.data[key]
        })
      } catch (e) {
        this.error = e.response.data.error
      }
    },

    editItem (item) {
      this.editedIndex = this.coachs.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log(this.editedItem)
      this.dialog = true
    },

    async deleteItem (item) {
      const index = this.coachs.indexOf(item)
      this.editedItem = Object.assign({}, item)
      var conf = confirm('Êtes vous sûr de vouloir supprimer ce coach ?')
      if (conf) {
        try {
          const deleted = await AdminService.deleteCoach(this.editedItem._id)
          if (deleted) {
            this.coachs.splice(index, 1)
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
      if (typeof this.editedItem.avatar !== 'undefined') {
        this.avatarUrl = await this.uploadImage()
      }
      if (this.editedIndex > -1) { // Edit coach case
        try {
          const edited = await AdminService.editCoach({
            _id: this.editedItem._id,
            firstName: this.editedItem.firstName,
            lastName: this.editedItem.lastName,
            email: this.editedItem.email,
            description: this.editedItem.description,
            profilPicture: this.avatarUrl
          })
          if (edited) {
            this.editedItem.profilPicture = this.avatarUrl
            Object.assign(this.coachs[this.editedIndex], this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (e) {
          this.dialogError = 'Modification non prise en compte. Il est possible que ce nom existe déjà'
        }
      } else { // New coach case
        try {
          const res = await AdminService.createCoach({
            firstName: this.editedItem.firstName,
            lastName: this.editedItem.lastName,
            email: this.editedItem.email,
            description: this.editedItem.description,
            profilPicture: this.avatarUrl
          })
          if (res.data.coach.email) {
            this.editedItem.profilPicture = this.avatarUrl
            this.coachs.push(this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (error) {
          this.dialogError = error.response.data.errors
          // this.dialogError = 'Impossible de rajouter ce coach. Vérifier que vous avez rempli les champs Prénom, Nom et E-mail. Si c\'est le cas, il est probable qu\'il existe déjà.'
        }
      }
    },
    async uploadImage() {
      this.saving = true
      try {
        const avatarUrl = await AdminService.avatarUpload(this.editedItem.avatar.formData)
        this.savedAvatar()
        return avatarUrl.data.imageUrl
      } catch (error) {
        this.dialogError = error.response.data.errors
      }
    },
    savedAvatar() {
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
.profilPicture{
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
