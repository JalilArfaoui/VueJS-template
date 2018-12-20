<template>
  <v-layout justify-center>
    <h1>This page is your dashboard {{name}}</h1>
    <!-- <v-flex xs6>
      <panel title="Connexion">
      <slot>
        <v-form
        name="login-form"
        autocomplete="true"
        v-model="valid"
        ref="form">
        <v-text-field
          label="Email"
          type="email"
          name="email"
          v-model="email"
          required
          :rules="emailRules"
          >
        </v-text-field>
        <br>
        <v-text-field
          label="Mot de passe"
          type="password"
          name="password"
          v-model="password"
          required
          :rules="passwordRules"
          :counter="34"
          >
        </v-text-field>
      </v-form>
        <br>
        <v-alert
          :value="error"
          type="error"
          dismissible="true"
          icon="warning"
          color="error"
          outline
          >
          {{error}}
        </v-alert>
        <br>
        <v-btn
          dark
          @click="login"
          :class="{ red: !valid, green: valid }">
          Connexion
        </v-btn>
      </slot>
    </panel>
</v-flex> -->
</v-layout>
</template>

<script>
/* eslint-disable no-useless-escape */
import Panel from './Panel'
import AuthenticationService from '../services/AuthenticationService'
// import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    Panel
  },
  data () {
    return {
      name: this.$store.state.user.name,
      email: '',
      error: ''
    }
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
    async login () {
      try {
        if (!this.$refs.form.validate()) {
          console.log('ERROR')
        } else {
          const res = await AuthenticationService.login({
            email: this.email,
            password: this.password
          })
          // if res = new User -> Page bienvenue

          // set token and user to true in the store
          this.$store.dispatch('setToken', res.data.token)
          this.$store.dispatch('setUser', res.data.user)
            .then(() => this.$router.push('/dashboard'))
        }
      } catch (e) {
        this.error = e.response.data.error
      }
    }
  }
  // }
}
</script>

<style scoped>
</style>
