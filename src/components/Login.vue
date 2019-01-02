<template>
  <v-layout justify-center>
    <v-flex lg6>
      <v-alert
        v-show = "authRequired"
        type="error"
        icon="warning"
        color="error"
        outline
        >
        Vous devez d'abord vous authentifier avant de pouvoir accéder à cette page.
      </v-alert>
      <v-alert
        v-show = "isUserLoggedIn"
        type="error"
        icon="priority_high"
        color="warning"
        outline
        >
        Vous êtes déjà authentifié avec l'adresse {{userEmail}}
      </v-alert>

      <panel title="Connexion">
      <slot>
        <v-form
        name="login-form"
        autocomplete="true"
        v-model="valid"
        ref="form"
        v-on:keyup.enter="submit"
        >
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
          v-show="confirmedUser"
          label="Mot de passe"
          type="password"
          name="password"
          v-model="password"
          required
          :rules="passwordRules"
          :counter="34"
          >
        </v-text-field>
        <!-- <router-link
          v-show="confirmedUser"
          name="resetPwd"
          to="/resetPwd"
          tag="pwdReset"
          @click="pwdReset"
          > -->
          <a
            v-show="confirmedUser"
            @click="pwdReset">
            Mot de passe oublié ?
          </a>
        <!-- </router-link> -->
      </v-form>
        <br>
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
        <br>
        <v-btn
          v-show="confirmedUser"
          dark
          @click="login"
          :class="{ red: !valid, green: valid }">
          Connexion
        </v-btn>
        <v-btn
          v-show="newUser"
          dark
          @click="demarrer"
          class="green">
          Démarrer
        </v-btn>
      </slot>
    </panel>
</v-flex>
</v-layout>
</template>

<script>
/* eslint-disable no-useless-escape */
import Panel from './Panel'
import AuthenticationService from '../services/AuthenticationService'
import EmailService from '../services/EmailService'
const _ = require('lodash')
const Joi = require('joi-browser')
// import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    Panel
  },
  data () {
    return {
      valid: false,
      email: '',
      password: '',
      error: '',
      emailRules: [
        (v) => !!v || 'L\'adresse E-mail est nécessaire',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'L\'adresse E-mail doit être valide'
      ],
      passwordRules: [
        (v) => !!v || 'Le mot de passe est nécessaire',
        (v) => v && (v.length >= 8 || 'Le mot de passe doit contenir au minimum 8 charactères dont 1 chiffre')
      ],
      authRequired: null,
      isUserLoggedIn: null,
      userEmail: null,
      confirmedUser: null,
      newUser: null,
      unknownUser: null
    }
  },
  watch: {
    email: function () {
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    this.email = this.$store.state.user
    this.debouncedGetAnswer = _.debounce(this.isUser, 400)
  },
  mounted () {
    console.log(process.env.VUE_APP_SERVER_PORT)
    if (this.$route.query.authRequired) {
      this.authRequired = this.$route.query.authRequired
    }
    if (this.$store.state.isUserLoggedIn) {
      this.$router.push('/dashboard')
      // this.isUserLoggedIn = this.$store.state.isUserLoggedIn
      // this.userEmail = this.$store.state.user.email
    }
  },
  methods: {
    async isUser () {
      try {
        const schema = {
          email: Joi.string().email({ minDomainAtoms: 2 })
        }
        const result = Joi.validate({ email: this.email }, schema)
        if (result.error) {
          // console.log('ERROR')
        } else {
          this.error = false
          const state = await AuthenticationService.findByEmail({
            email: this.email
          })
          if (state.data === 'newUser') {
            this.newUser = true
            this.confirmedUser = false
          } else if (state.data === 'confirmedUser') {
            this.newUser = false
            this.confirmedUser = true
          }
        }
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    async login () {
      try {
        if (!this.$refs.form.validate()) {
          console.log('ERROR')
        } else {
          const res = await AuthenticationService.login({
            email: this.email,
            password: this.password
          })

          // set token and user to true in the store
          this.$store.dispatch('setToken', res.data.token)
          this.$store.dispatch('setUser', res.data.user)

          if (res.data.user.capacity === 'admin') {
            // set admin to true in the store
            this.$store.dispatch('setAdmin', res.data.user)
              .then(() => this.$router.push('/admin'))
          } else {
            this.$router.push('/dashboard')
          }
        }
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    async pwdReset () {
      // console.log(this.email)
      // console.log('hello')
      try {
        AuthenticationService.resetHash({
          to: this.email
        })
          .then(() => EmailService.sendResetPwdEmail({
            to: this.email
          })) // send email with hash
          .then(() => this.$store.dispatch('setUser', this.email))
          .then(() => this.$router.push('/resetpwd'))
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    demarrer () {
      this.$store.dispatch('setUser', this.email)
        .then(this.$router.push('/welcome'))
    }
  }
  // }
}
</script>

<style scoped>
</style>
