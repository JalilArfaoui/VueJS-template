<template>
  <v-layout justify-center>
    <v-flex xs6>
      <h1>Bienvenue {{name | email}}</h1>
      <panel :title="'Étape ' + stepNbr + '/4 - ' + stepDesc">
      <slot>
        <v-form
        name="login-form"
        autocomplete="false"
        v-model="valid"
        ref="form">
        <v-text-field
          v-show="!activationStep"
          label="Prénom"
          type="string"
          name="name"
          v-model="name"
          required
          >
        </v-text-field>
        <br>
        <v-text-field
          v-show="nameRegistered && !activationStep"
          label="Mot de passe"
          type="password"
          name="password"
          v-model="password"
          required
          :rules="passwordRules"
          :counter="30"
          >
        </v-text-field>
        <v-flex xs6>
          <p v-show="pwdRegistered && !activationStep">
            Les conditions générales de vente (CGV) sont des informations fournies par un fournisseur à son client sur les conditions légales de vente de ses produits ou services en l'absence d'accord spécifique.
            Sans mention expresse, l'achat d'un bien ou d'un service à ce fournisseur constitue une acceptation implicite de ces conditions.
            Les conditions générales de vente sont le pendant des conditions générales d'achat (CGA) côté client.
          </p>
        </v-flex>
        <v-checkbox
          v-show="pwdRegistered && !activationStep"
          :label="'J\'ai lu et accepte les conditions générales d\'utilisations et la politique de confidentialité'"
          v-model="acceptationBox">
        </v-checkbox>
        <p v-show="activationStep">
          Un code vient vient de vous être envoyé à l'adresse {{this.email}}
          <br> Recopiez ce code ci-dessous pour terminer votre inscription.
        </p>
        <v-text-field
          v-show="activationStep"
          label="Renseigner le code envoyé par mail"
          type="string"
          name="activation"
          autocomplete="false"
          v-model="hash"
          required
          :counter="6"
          >
        </v-text-field>
        <p
        v-show="activationStep"
        ><i>
          Si vous ne le trouvez pas dans votre boite mail, vérifiez dans vos spams.
        </i></p>
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
          :disabled="!acceptationBox"
          color="primary"
          @click="nextStep"
        >
          Suivant
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
      name: '',
      email: this.$store.state.user,
      password: '',
      error: '',
      hash: '',
      emailRules: [
        (v) => !!v || 'L\'adresse E-mail est nécessaire',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'L\'adresse E-mail doit être valide'
      ],
      passwordRules: [
        (v) => !!v || 'Le mot de passe est nécessaire',
        (v) => v && (v.length >= 8 || 'Le mot de passe doit contenir au minimum 8 charactères dont 1 chiffre')
      ],
      nameRegistered: false,
      pwdRegistered: false,
      acceptationBox: false,
      activationStep: false,
      stepNbr: 1,
      stepDesc: 'Veuillez renseigner votre prénom'
    }
  },
  watch: {
    name: function () {
      this.debouncedGetName()
    },
    password: function () {
      this.debouncedGetPwd()
    }
  },
  created: function () {
    this.debouncedGetName = _.debounce(this.isName, 400)
    this.debouncedGetPwd = _.debounce(this.isPwd, 400)
  },
  methods: {
    async nextStep () {
      try {
        if (this.stepNbr === 1) { // register name
          const res = await AuthenticationService.registerName({
            name: this.name,
            email: this.email
          })
          if (res) {
            AuthenticationService.resetHash({
              to: this.email
            })
            .then(
              EmailService.sendAuthEmail({
                to: this.email
              })
            ).then(
              this.acceptationBox = false,
              this.nameRegistered = true,
              this.stepNbr = 2,
              this.stepDesc = 'Veuillez renseigner un mot de passe'
            )// display green icon
          }
        } else if (this.stepNbr === 2) { // register password
          const res = await AuthenticationService.registerPwd({
            email: this.email,
            password: this.password
          })
          if (res) {
            // display green icon
            this.pwdRegistered = true
            this.stepNbr = 3
            this.stepDesc = 'Veuillez lire et accepter les conditions d’utilisations'
            this.acceptationBox = false
          }
        } else if (this.stepNbr === 3) {
          this.activationStep = true
          this.stepNbr = 4
          this.stepDesc = 'Validation de l\'adresse e-mail'
        } else if (this.stepNbr === 4) {
          const response = await AuthenticationService.confirmUser({
            hash: this.hash,
            email: this.email
          })
          if (response) {
            this.$store.dispatch('setToken', response.data.token)
            this.$store.dispatch('setUser', response.data.user)
              .then(() => this.$router.push('/dashboard'))
          } else {
            this.error = response.error
          }
        }
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    isName () {
      const nameSchema = {
        name: Joi.string().alphanum().min(3).max(30).required()
      }
      const result = Joi.validate({ name: this.name }, nameSchema)
      if (!result.error) {
        this.acceptationBox = true
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
    }
  }
}
</script>

<style scoped>
</style>
