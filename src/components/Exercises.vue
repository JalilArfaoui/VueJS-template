<template >
  <div>
    <v-layout justify-space-around column>
      <p>
        {{secondLevel.name}}
        <!--<ul>
          <li
            v-for="item in secondLevel.items"
            >
             <div>
              Titre de l'item : {{ item.name }} </br>
              Type : {{ item.type }} </br>
              Consigne : {{ item.consigne }} </br>
              Media : {{ item._mediaIn }} </br>
                <videoPlayer
                  v-if="item._mediaIn"
                  :_videoID="item._mediaIn"
                />
              L'utilisateur doit t'il s'enregistrer ? {{ item.record }} </br>
              Conclusion : {{ item.conclusion }} </br>
              Bouton gauche : {{ item.leftButton }} </br>
              Bouton droit : {{ item.rightButton }} </br>
            </div>
          </li>
        </ul>-->
      </p>
    </v-layout>
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
      // secondLevel: {
      //   _id: this.$store.state.secondLevel._id,
      //   name: this.$store.state.secondLevel.name
      // },
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

    // activeCourse(currentCourse) {
    //   this.currentCourse = currentCourse
    // },
  }
}
</script>

<style scoped>

</style>
