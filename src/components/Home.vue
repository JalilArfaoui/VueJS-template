<template >
  <div >
    <v-layout justify-space-around column>
      <v-toolbar flat color="white">
        <v-toolbar-title>Circuits</v-toolbar-title>
        <a @click="logout">Disconnect</a>
      </v-toolbar>
      <v-tabs
        color="cyan"
        dark
        slider-color="yellow"
      >
        <v-tab
          v-for="(course,n) in courses"
          :key="n"
          ripple
          @click="activeCourse(course)"
        >
          {{ course }}
        </v-tab>
      </v-tabs>
        <div>
          <ul>
            <firstlevelComponent
              v-for="firstLevel in firstLevels"
              :key="firstLevel._id"
              :firstLevel="firstLevel"
            />

          </ul>
        </div>
            <!-- <v-tabs-items
              v-model="currentCourse"
            >
              <v-tab-item
                v-for="(course,n) in courses"
                :key="n"
              > -->

          <!-- </v-tab-item>
        </v-tabs-items> -->
      <!-- </v-tabs> -->
        <!-- <ul>
        <li v-for="course in courses">
          {{course}}
          <ul>
            <firstlevelComponent
              v-for="firstLevel in firstLevels[course]"
              :key="firstLevel._id"
              :firstLevel="firstLevel"
            />
          </ul>
        </li>

  		</ul> -->
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
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import LevelService from '../services/LevelService'
import firstlevelComponent from './firstlevelComponent'
// import ItemService from '../services/ItemService'

export default {
  components: {
    firstlevelComponent
  },
  data () {
    return {
      name: this.$store.state.user.name,
      currentCourse: 'Niveau 1',
      currentFL: {},
      currentSL: {},
      currentItem: {},courses: ['Niveau 1', 'Niveau 2', 'Niveau 3'],
      dialog: false,
      error: '',
      secondLevels: [],
      items: [],
      itemTypes: ['Audio Guide', 'Audio Coach', 'Enregistrement Audio', 'Enregistrement Video', 'Lecture Audio', 'Lecture Video', 'Texte Liant', 'Texte Commentaire', 'Test Questionnaire', 'Texte Exercice', 'Photos Exercice', 'Texte Notes', 'Video Coach'],
      firstLevels: []
    }
  },
  computed: {
    levelNum () {
      return this.level === 'firstLevel' ? '1': '2'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    'currentCourse' () {
      this.getFirstLevels()
      console.log(this.currentCourse)
      console.log(this.firstLevels);
    }
  },
  beforeMount () {
    this.getFirstLevels()
    console.log(this.firstLevels)
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
    activeCourse(currentCourse) {
      this.currentCourse = currentCourse
    },
    logout() {
      this.$store.dispatch('setClient', null)
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setAdmin', null)
      this.$store.dispatch('setUser', null)
        .then(() => this.$router.push('/login'))
    },
    async getFirstLevels () {
        // for (let course of this.courses) {
          try {
            let tempFirstLevels = await LevelService.getFirstLevels({
              course: this.currentCourse
            })
            this.firstLevels = Object.keys(tempFirstLevels.data).map((key) => {
              return tempFirstLevels.data[key]
            })
          } catch (e) {
            this.error = e.response
          }
        // }
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

.Audio.Guide{
  background-color: #80DEEA !important;
}
.Audio.Enregistrement{
  background-color: #0097A7 !important;
}
.Audio.Lecture{
  background-color: #26C6DA !important;
}
.Audio.Coach{
  background-color: #84FFFF !important;
}
.Video.Enregistrement{
  background-color: #1976D2 !important;
}
.Video.Lecture{
  background-color: #42A5F5 !important;
}
.Video.Coach{
  background-color: #82B1FF !important;
}
.Texte.Liant{
  background-color: #A1887F !important;
}
.Texte.Commentaire{
  background-color: #8D6E63 !important;
}
.Texte.Exercice{
  background-color: #6D4C41 !important;
}
.Texte.Notes{
  background-color: #D7CCC8 !important;
}
.Photos.Exercice{
  background-color: #FFD54F !important;
}
.Test.Questionnaire{
  background-color: #AB47BC !important;
}
</style>
