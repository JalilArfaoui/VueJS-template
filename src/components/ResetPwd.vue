<template>
  <v-layout justify-center>
    <v-flex xs6>
      <h1>Bonjour {{name || email}}</h1>
      <panel :title="'Vérification de l\'identité'">
      <slot>
        <v-form
        name="pwdReset-form"
        autocomplete="false"
        v-model="valid"
        ref="form">
        <p v-show="!auth">
          Avant de réinitialiser votre mot de passe, nous avons besoin de vérifier votre identité. Un e-mail vient de vous être envoyé avec un code de renouvellement. Recopiez ce code ci-dessous. Si vous ne le trouvez pas dans votre boite mail, vérifiez dans vos spams.
        </p>
        <v-text-field
          v-show="!auth"
          autocomplete="false"
          label="Renseigner le code envoyé par mail"
          type="string"
          name="authentication"
          v-model="hash"
          required
          :counter="6"
          >
        </v-text-field>
        <p mt-5 v-show="!auth">
          <i>Si vous ne le trouvez pas dans votre boite mail, vérifiez dans vos spams.</i>
        </p>
        <v-text-field
          v-show="auth"
          label="Mot de passe"
          type="password"
          name="password"
          v-model="password"
          required
          :rules="passwordRules"
          :counter="34"
          autocomplete="false"
          >
        </v-text-field>
      </v-form>
        <br>
        <v-alert
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
          v-show="!auth"
          color="primary"
          @click="verifyHash"
        >
          Vérifier
        </v-btn>
        <v-btn
          v-show="auth"
          :disabled="!acceptationBox"
          color="primary"
          @click="resetPwd">
          Mettre à jour
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
      name: '',
      email: this.$store.state.user,
      password: '',
      error: '',
      hash: '',
      passwordRules: [
        (v) => !!v || 'Le mot de passe est nécessaire',
        (v) => v && (v.length >= 8 || 'Le mot de passe doit contenir au minimum 8 charactères dont 1 chiffre')
      ],
      auth: false,
      acceptationBox: false
    }
  },
  watch: {
    password: function () {
      this.debouncedGetPwd()
    }
  },
  created: function () {
    this.debouncedGetPwd = _.debounce(this.isPwd, 400)
  },
  methods: {
    async verifyHash () {
      try {
        const response = await AuthenticationService.verifyHash({
          hash: this.hash,
          email: this.email
        })
        if (response) {
          // this.$store.dispatch('setToken', response.data.token)
          // this.$store.dispatch('setUser', response.data.user)
          this.auth = true
        } else {
          this.error = response.error
        }
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    isPwd () {
      const pwdSchema = {
        password: Joi.string().min(8).regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
      }
      const result = Joi.validate({ password: this.password }, pwdSchema)
      if (!result.error) {
        this.acceptationBox = true
      }
      // console.log(this.acceptationBox)
    },
    async resetPwd () {
      try {
        const res = await AuthenticationService.registerPwd({
          email: this.email,
          password: this.password
        })
        if (res) {
          this.$router.push('/login')
        }
      } catch (e) {
        this.error = e.response.data.error
      }
    }
  }
}
</script>

<style scoped>
</style>
