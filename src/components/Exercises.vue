<template>
  <div>
  <v-stepper v-model="ex" d-flex column>
      <v-stepper-header class="shadow-1">
        <div
          class="step"
          v-bind:class="{laststep : e === (secondLevel.items.length-1)}"
          v-for="(item, e) in secondLevel.items"
          :key="e"
        >
          <v-stepper-step
            :edit-icon="'check'"
            :complete-icon="'edit'"
            :step="e + 1"
            :complete="(e + 1 ) <= ex"
            :editable="(e + 1) < ex"
          >
            {{ item.name }}

          </v-stepper-step>
            <v-divider v-if="e < secondLevel.items.length - 1"></v-divider>
        </div>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content
          v-for="(exercise, i) in secondLevel.items"
          :key="i"
          :step="i + 1"
        >
          <v-card class="my-auto bg-third shadow-0" height="300px">
            {{ exercise.consigne }}
            {{ exercise.conclusion }}
          </v-card>
          <!-- <v-spacer></v-spacer> -->
          <v-card-actions justify-space-between>
              <v-btn v-if="i === 0" flat @click="exit()">{{exercise.leftButton || "Retour"}}</v-btn>
              <v-btn v-else flat @click.native="ex = i">{{exercise.leftButton || "Retour"}}</v-btn>
              <!-- <v-spacer></v-spacer> -->
              <v-btn v-if="i === secondLevel.items.length - 1" color="primary" @click.native="ex = 42">{{exercise.rightButton || "Terminer"}}</v-btn>
              <v-btn v-else color="primary" @click.native="ex = i + 2">{{exercise.rightButton || "Suivant"}}</v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <alertBox :error="error"/>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
// import ItemService from '../services/ItemService'
import alertBox from './alertBox'

export default {
  components: {
    alertBox
  },
  data () {
    return {
      name: this.$store.state.user.name,
      secondLevel: this.$store.state.secondLevel,
      ex: 0,
      error: ''
      // currentCourse: 'Niveau 1',
      // currentFL: {},
      // currentSL: {},
      // currentItem: {},courses: ['Niveau 1', 'Niveau 2', 'Niveau 3'],
      // dialog: false,
      // secondLevels: [],
      // items: [],
      // itemTypes: ['Audio Guide', 'Audio Coach', 'Enregistrement Audio', 'Enregistrement Video', 'Lecture Audio', 'Lecture Video', 'Texte Liant', 'Texte Commentaire', 'Test Questionnaire', 'Texte Exercice', 'Photos Exercice', 'Texte Notes', 'Video Coach'],
      // firstLevels: []
    }
  },
  computed: {
  },
  watch: {
    'ex' () {
      console.log(this.ex);
    }
    // dialog (val) {
    //   val || this.close()
    // }
  },
  beforeMount () {
    // this.getFirstLevels()
    // console.log(this.firstLevels)
  },
  created () {
    // this.getFirstLevels ()
    // console.log(this.firstLevels);
  },
  mounted () {
    if (localStorage.name) {
      this.name = localStorage.name
    }
    if (localStorage.setUser) {
      this.email = localStorage.setUser
    }
    // this.activeCourse('Niveau 1')
  },
  methods: {
    exit() {
      this.$router.push('/')
    }
    // activeCourse(currentCourse) {
    //   this.currentCourse = currentCourse
    // },
  }
}
</script>

<style lang="scss">
.v-stepper{
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.v-stepper__header{
  background-color: #FCF8EE;
  flex-wrap: nowrap;
  padding-left: 10%;
  padding-right: 10%;
  .step{
    width: -webkit-fill-available;
    display: flex;
  }
  .laststep{
    max-width: fit-content;
  }
}

.v-stepper__items{
  height: inherit;

  .v-stepper__content {
    padding: 24px 20% 16px !important;
    background-color: #FCF8EE;
    height: 100%;

    .v-stepper__wrapper{
      height: inherit;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .v-card__actions{
        justify-content: space-between;
      }
    }
  }
}




/* .footer-exercises{
  position: fixed;
  height: 25vh;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
} */
</style>
