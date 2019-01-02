<template>
  <div>
  <AdminNav />
  <v-layout id="admin-layout" justify-space-around column>
    <v-toolbar flat color="white">
        <v-toolbar-title>Liste des clients</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">Ajouter un client</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm10>
                <v-text-field
                  v-if=""
                  v-model="editedItem.name"
                  label="Nom">
                </v-text-field>
                <!-- <v-text-field v-if="this.editedIndex != -1" v-model="editedItem.capacity" label="Qualité"></v-text-field> -->
                <v-select
                  v-if=""
                  v-model="editedItem.type"
                  :items="types"
                  item-text="state"
                  item-value="abbr"
                  label="Type de client"
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
            {{dialogError}}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>

    <v-data-table
    :headers="headers"
    :items="clients"
    class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td>{{ props.index + 1 }}</td>
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.nbUsers }}</td>
      <td>{{ props.item.type }}</td>
      <td class="layout align-center justify-space-around">
        <v-icon
          small
          class="mr-2"
          @click="watchItem(props.item.name)"
          >
          remove_red_eye
        </v-icon>
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
// import Panel from '@/components/Panel'
import AdminNav from './AdminNav'
// import { SidebarMenu } from 'vue-sidebar-menu' // left Admin menu
import AdminService from '../services/AdminService'
// import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    // Panel,
    AdminNav
  },
  data () {
    return {
      name: this.$store.state.user.name,
      dialog: false,
      error: '',
      dialogError: '',
      clients: [],
      headers: [
        { text: '#', value: 'index' },
        { text: 'Entreprise', value: 'name' },
        { text: 'Nombre d\'utilisateurs', value: 'nbUsers' },
        { text: 'Type', value: 'type' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        type: ''
      },
      defaultItem: {
        name: '',
        type: ''
      },
      types: [
        'Entreprise',
        'Université/École',
        'Pré-vente'
      ]
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nouveau client' : 'Modifier le client'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  created () {
    this.getClients()
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
    async getClients () {
      try {
        const clients = await AdminService.getClients()
        this.clients = Object.keys(clients.data).map((key) => {
          return clients.data[key]
        })
      } catch (e) {
        this.error = e.response.data.error
      }
    },

    watchItem (item) {
      this.$store.dispatch('setClient', item)
      this.$router.push('AdminDetailsClient')
    },

    editItem (item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem (item) {
      const index = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      var conf = confirm('Êtes vous sûr de vouloir supprimer ce client ?')
      if (conf) {
        try {
          const deleted = await AdminService.deleteClient(this.editedItem._id)
          if (deleted) {
            this.clients.splice(index, 1)
          }
        } catch (e) {
          this.error = e.response.data.error
        }
      }
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async save () {
      if (this.editedIndex > -1) {
        try {
          const edited = await AdminService.editClient({
            _id: this.editedItem._id,
            name: this.editedItem.name,
            type: this.editedItem.type
          })
          if (edited) {
            Object.assign(this.clients[this.editedIndex], this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (e) {
          this.dialogError = 'Modification non prise en compte. Il est possible que ce nom existe déjà'
        }
      } else {
        try {
          const res = await AdminService.createClient({
            name: this.editedItem.name,
            type: this.editedItem.type
          })
          if (res.data.client.name) {
            this.clients.push(this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (error) {
          this.dialogError = 'Impossible de rajouter ce client. Il est possible qu\'il existe déjà ou que vous n\'avez pas sélectionné un type de client'
        }
      }
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
</style>
