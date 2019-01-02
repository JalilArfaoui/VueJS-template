<template>
  <v-toolbar fixed class="cyan" dark>
    <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
    <v-toolbar-title>
      <router-link to="home">
        Talk It Easy
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="">
      <v-btn flat >
        <router-link to="mediacapture">
          Vidéo
        </router-link>
      </v-btn>
      <v-btn flat v-if="!$store.state.isUserLoggedIn">
        <router-link to="login">
          Connexion
        </router-link>
      </v-btn>
      <v-btn flat
      v-if="$store.state.isUserLoggedIn"
      @click="logout"
      >
        Déconnexion
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$store.dispatch('setClient', null)
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setAdmin', null)
      this.$store.dispatch('setUser', null)
        .then(() => this.$router.push('/login'))
      // .then(() => this.$router.push('/login '))
    }
  }
}
</script>

<style scoped>
</style>
