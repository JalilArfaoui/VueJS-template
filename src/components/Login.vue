<template>
  <v-layout id="login" row d-flex justify-center align-center>
    <!-- <v-flex lg6>
      <v-img
        src="../assets/jobs.jpg"
        contain
        max-height="100vh"
      ></v-img>
    </v-flex> -->
  <!-- </v-layout>
  <v-layout justify-center lg6> -->
    <v-flex lg6 class="">
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

      <panel
        id="login-box"
        title="Connexion">
        <slot>
          <v-form
          name="login-form"
          autocomplete="false"
          v-model="valid"
          ref="form"
          v-on:keyup.enter="submit"
          >
            <v-text-field
              label="userName"
              type="text"
              name="userName"
              v-model="userName"
              required
              autocomplete="false"
              v-on:keyup.enter="fetchPublicKey"
              :rules="userNameRules"
            >
            </v-text-field>
            <br>
            <v-text-field
              v-show="publicKey"
              label="Clé privée"
              type="password"
              name="privateKey"
              ref="privateKey"
              v-model="privateKey"
              required
              :counter="256"
              :rules="privateKeyRules"
              autofocus
              v-on:keyup.enter="login"
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
              @click="reseting ? '' : pwdReset()">
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
            v-show="!confirmedUser"
            dark
            @click="fetchPublicKey"
            class="green">
            Démarrer
          </v-btn>
          <v-btn
            v-show="confirmedUser"
            :disabled="!valid"
            color="primary"
            @click="login"
            >
            Connexion
          </v-btn>
          <!-- <v-btn
            v-show="newUser"
            dark
            @click="demarrer"
            class="green">
            Démarrer
          </v-btn> -->

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
      adminPage: '',
      valid: false,
      password: '',
      error: '',
      authRequired: null,
      isUserLoggedIn: null,
      userEmail: null,
      confirmedUser: null,
      newUser: null,
      unknownUser: null,
      reseting: false,
      userName: '',
      userNames: [],
      userNameRules: [
        (username) => username.length > 5 || 'sqdfqsfds  ',
        (username) => this.userNames.includes(username) || "Utilisateur inconnu"
      ],
      privateKey: null,
      publicKey: null,
      privateKeyRules: [
        (pk) => true // TODO encrypt with publicKey and decrypt with privateKey to verify
      ]
    }
  },
  watch: {
    // email: function () {
    //   this.debouncedGetAnswer()
    // }
  },
  created: async function () {
    this.email = this.$store.state.user
    this.userNames = (await AuthenticationService.fetchUsers()).data;
    // this.debouncedGetAnswer = _.debounce(this.fetchPublicKey, 20)
  },
  mounted () {
    if (this.$route.query.authRequired) {
      this.authRequired = this.$route.query.authRequired
    }
    if (this.$store.state.isUserLoggedIn) {
      this.$router.push('/')
      // this.isUserLoggedIn = this.$store.state.isUserLoggedIn
      // this.userEmail = this.$store.state.user.email
    }
  },
  methods: {
    async fetchPublicKey () {
      try {
          const response = await AuthenticationService.fetchUser(this.userName);
          // TODO error
          this.publicKey = response.data.pub;
      } catch (e) {
        // TODO
        this.error = e.response.data.error
      }
    },
    async login () {
      try {
        if (!this.$refs.form.validate()) {
          console.log('ERROR')
        } else {

          // set token and user to true in the store
          this.$store.dispatch('setPublicKey', this.publicKey);
          this.$store.dispatch('setPrivateKey', this.privateKey);
          this.$store.dispatch('setUserName', this.userName);

          this.$router.push('/sessions')
        }
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    async pwdReset () {
      this.reseting = true
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

<style lang="scss" scoped>
.v-image {
    background-color: #000;
  }
#login-box{
  margin: 0 10%;
}
</style>
