<template>
  <div>
    <AdminNav />
    <v-layout id="admin-layout" justify-space-around column>
      <v-toolbar flat color="white">
        <v-toolbar-title>SMART B</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <a @click="logout">Disconnect</a>
      </v-toolbar>
      <v-layout
        row
      >
        <v-card
          class="mx-auto"
          color="white lighten-3"
          max-width="600"
        >
          <v-card-title>
            <v-layout
              column
              align-start
            >
              <div class="caption grey--text text-uppercase">
                Nombre de clients
              </div>
              <div>
                <strong>{{clients.length}}</strong> clients
              </div>
            </v-layout>
          </v-card-title>
        </v-card>
        <v-card
          class="mx-auto"
          color="white lighten-4"
          max-width="600"
        >
          <v-card-title>
            <v-layout
              column
              align-start
            >
              <div class="caption grey--text text-uppercase">
                Nombre d'utilisateurs
              </div>
              <div>
                <strong>{{users.length}}</strong> utilisateurs
              </div>
              <div>
                <strong>{{users.filter(x => x.state == 'Activé').length}}</strong> actifs
              </div>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-layout>
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
      users: [],
      clients: [],
      adminPage: true,
      error: ''
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
    logout() {
      this.$store.dispatch('setClient', null)
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setAdmin', null)
      this.$store.dispatch('setUser', null)
        .then(() => this.$router.push('/login'))
    },
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
    async getUsers () {
      try {
        const users = await AdminService.getUsers()
        this.users = Object.keys(users.data).map((key) => {
          return users.data[key]
        })
      } catch (e) {
        this.error = e.response.data.error
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
