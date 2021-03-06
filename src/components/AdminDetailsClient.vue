<template>
  <div>
  <AdminNav />
  <v-layout id="admin-layout" justify-space-around column>
    <v-toolbar flat color="white">
        <v-toolbar-title>Utilisateurs {{ company }}</v-toolbar-title>
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
          <span class="headline">{{ company }}</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm10>
                <v-text-field
                  v-model="editedItem.email"
                  label="E-mail">
                </v-text-field>
                <!-- <v-text-field
                  v-if="this.editedIndex != -1"
                  v-model="editedItem.coach"
                  label="Coach">
                </v-text-field> -->
                <v-select
                  v-model="editedItem._coach"
                  :items="coachs"
                  item-value="_id"
                  label="Coach"
                  persistent-hint
                  single-line
                >
                  <template slot="selection" slot-scope="data">
                    {{ data.item.firstName }} {{ data.item.lastName }}
                  </template>
                  <template slot="item" slot-scope="data">
                    {{ data.item.firstName }} {{ data.item.lastName }}
                  </template>
                </v-select>
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
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>

    <v-data-table
    :headers="headers"
    :items="users"
    :pagination.sync="pagination"
    class="elevation-1"
    >
    <template slot="pageText" slot-scope="props" pageStop="20">
      Utilisateurs {{ props.pageStart }} à {{ props.pageStop }} sur {{ props.itemsLength }}
    </template>
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.email }}</td>
      <td>{{ props.item.importedAt }}</td>
      <td>{{ props.item.coachFirstName }} {{ props.item.coachLastName }}</td>
      <!-- <td>{{ props.item.coach }}</td> -->
      <!-- <td>{{ props.item.capacity }}</td> -->
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
      // name: this.$store.state.user.name,
      name: '',
      company: this.$store.state.client,
      dialog: false,
      error: '',
      dialogError: '',
      users: [],
      coachs: [],
      headers: [
        {
          text: 'Prénom',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Email', value: 'email' },
        // { text: 'Client', value: 'company' },
        { text: 'Importé le', value: 'importedAt' },
        { text: 'Coach', value: 'coach' },
        // { text: 'Qualité', value: 'capacity' },
        { text: 'Activation', value: 'state' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      pagination: {
        rowsPerPage: 25
      },
      editedIndex: -1,
      editedItem: {
        name: '',
        company: '',
        email: '',
        // capacity: '',
        importedAt: null,
        _coach: '',
        state: ''
      },
      defaultItem: {
        name: '',
        company: this.$store.state.client,
        email: '',
        // capacity: 'user',
        importedAt: null,
        _coach: '',
        state: 'Invité'
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
    this.getCoachs()
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
        const users = await AdminService.getUsers(this.company)
        this.users = Object.keys(users.data).map((key) => {
          return users.data[key]
        })
        this.users.forEach( user => user.importedAt = new Date(user.importedAt).toLocaleDateString("fr-FR"))
        this.users.forEach( user => {
          var coachIndex = this.coachs.findIndex(x => x._id === user._coach)
          user.coachFirstName = this.coachs[coachIndex].firstName,
          user.coachLastName = this.coachs[coachIndex].lastName
        })
      } catch (e) {
        this.error = e.response.data.error
      }
    },
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
      if (this.editedIndex > -1) { // Edit case
        try {
          const edited = await AdminService.editUser(this.editedItem)
          if (edited) {
            var coachIndex = this.coachs.findIndex(x => x._id === this.editedItem._coach)
            this.editedItem.coachFirstName = this.coachs[coachIndex].firstName
            this.editedItem.coachLastName = this.coachs[coachIndex].lastName
            Object.assign(this.users[this.editedIndex], this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (e) {
          this.dialogError = e.response.data.error
        }
      } else {
        try {
          const res = await AdminService.register({
            email: this.editedItem.email,
            company: this.company,
            _coach: this.editedItem._coach
          })
          if (res.data.user.email) {
            this.editedItem = res.data.user
            this.editedItem.importedAt = new Date(this.editedItem.importedAt).toLocaleDateString("fr-FR")

            var coachIndex = this.coachs.findIndex(x => x._id === this.editedItem._coach)
            this.editedItem.coachFirstName = this.coachs[coachIndex].firstName
            this.editedItem.coachLastName = this.coachs[coachIndex].lastName

            this.users.push(this.editedItem)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte'
          }
        } catch (error) {
          this.dialogError = error.response.data.error
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
