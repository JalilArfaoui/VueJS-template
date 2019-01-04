<template>
  <div>
  <AdminNav />
  <v-layout id="admin-layout" justify-space-around column>
    <v-toolbar flat color="white">
        <v-toolbar-title>Administration</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">Nouvel utilisateur</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm10>
                <v-text-field v-if="this.editedIndex == -1" v-model="editedItem.email" label="E-mail"></v-text-field>
                <!-- <v-text-field v-if="this.editedIndex != -1" v-model="editedItem.capacity" label="Qualité"></v-text-field> -->
                <v-select
                  v-if="this.editedIndex != -1"
                  v-model="editedItem.capacity"
                  :items="capacities"
                  item-text="state"
                  item-value="abbr"
                  label="editedItem.capacity"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>

    <v-data-table
    :headers="headers"
    :items="users"
    class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.company }}</td>
      <td>{{ props.item.email }}</td>
      <td>{{ props.item.capacity }}</td>
      <td>{{ props.item.state }}</td>
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
      users: [],
      headers: [
        {
          text: 'Prénom',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Entreprise', value: 'company' },
        { text: 'Email', value: 'email' },
        { text: 'Qualité', value: 'capacity' },
        { text: 'Activation', value: 'state' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        company: '',
        email: '',
        capacity: '',
        state: ''
      },
      defaultItem: {
        name: '',
        company: '',
        email: '',
        capacity: 'user',
        state: 'newUser'
      },
      capacities: [
        'user',
        'admin'
      ]
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  created () {
    this.getUsers()
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
    async getUsers () {
      try {
        const users = await AdminService.getUsers()
        this.users = Object.keys(users.data).map((key) => {
          return users.data[key]
        }).filter( (user) => user.capacity == 'admin' )
      } catch (e) {
        this.error = e.response.data.error
      }
    },

    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem (item) {
      const index = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      var conf = confirm('Êtes vous sûr de vouloir supprimer cet utilisateur ?')
      if (conf) {
        try {
          const deleted = await AdminService.deleteUser(this.editedItem._id)
          if (deleted) {
            this.users.splice(index, 1)
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
      if (this.editedIndex > -1) {
        try {
          console.log(this.editedItem)
          const edited = await AdminService.editUser(this.editedItem)
          if (edited) {
            Object.assign(this.users[this.editedIndex], this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (e) {
          this.error = e.response.data.error
        }
      } else {
        try {
          console.log(this.editedItem)
          const res = await AdminService.register({
            email: this.editedItem.email
          })
          if (res.data.user.email) {
            this.users.push(this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (error) {
          this.error = error.response.data.error
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
