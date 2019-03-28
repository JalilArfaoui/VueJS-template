<template >
  <!-- <v-card
    color="grey lighten-4"
    flat
  > -->
    <v-toolbar color="purple accent-4" dark v-if="!adminPage">
      <!-- <router-link to="./">
        TALK IT EASY
      </router-link> -->
      <v-btn @click="toHome" flat>
        TALK IT EASY
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn @click="toAdmin" flat v-if="$store.state.isUserAdmin">
        <!-- <router-link to="admin" v-if="$store.state.isUserAdmin"> -->
          Admin
        <!-- </router-link> -->
      </v-btn>
      <v-btn @click="toLogin" flat v-if="!$store.state.isUserLoggedIn">
        <!-- <router-link to="login" v-if="!$store.state.isUserLoggedIn"> -->
          Connexion
        <!-- </router-link> -->
      </v-btn>
      <v-menu :nudge-width="100" v-if="$store.state.isUserLoggedIn">
       <v-btn
         slot="activator"
         flat
       >
         <span>{{name}}</span>
       </v-btn>
       <v-list>
         <v-list-tile>
           <v-btn flat
           v-if="$store.state.isUserLoggedIn"
           @click="logout"
           >
             Déconnexion
           </v-btn>
         </v-list-tile>
       </v-list>
      </v-menu>

      <!-- <v-menu offset-y>
       <v-btn
         slot="activator"
         dark
       >
         <span v-if="this.locale === 'en'">English</span>
         <span v-if="this.locale === 'fr'">Français</span>
       </v-btn>
       <v-list>
         <v-list-tile
           v-for="(locale, index) in locales"
           :key="index"
           @click="switchLocale(index)"
         >
           <v-list-tile-title>{{ locale.title }}</v-list-tile-title>
         </v-list-tile>
       </v-list>
     </v-menu> -->
    </v-toolbar>
  <!-- </v-card> -->


</template>

<script>
export default {
  data () {
    return {
      name: this.$store.state.user.name,
      locale: 'fr',
      locales: [
        { locale: 'en', title: 'English', icon: '@/assets/images/flag_gb_24.png' },
        { locale: 'fr', title: 'Français', icon: '@/assets/images/flag_fr_24.png' }
      ]
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('setClient', null)
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setAdmin', null)
      this.$store.dispatch('setUser', null)
        .then(() => this.$router.push('/login'))
      // .then(() => this.$router.push('/login '))
    },
    toHome () {
      this.$router.push('/')
    },
    toLogin () {
      this.$router.push('/login')
    },
    toAdmin () {
      this.$router.push('/admin')
    },
    toMediaCapture () {
      this.$router.push('/mediacapture')
    }
  }
}
</script>

<style scoped>
</style>
