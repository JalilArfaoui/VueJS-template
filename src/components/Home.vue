<template >
  <div>
    <page-header />
    <v-layout justify-space-around row mt-3 px-5>
      <v-flex sm8>
        <v-tabs
          color="white"
          light
          slider-color="white"
          fixed-tabs
        >
          <v-tab
            v-for="(course,n) in courses"
            :key="n"
            @click="activeCourse(course)"
          >
            {{ course }}
          </v-tab>
        </v-tabs>
        <div class="bg-white br-4 pa-3">
          <ul>
            <firstlevelComponent
              v-for="firstLevel in firstLevels"
              :key="firstLevel._id"
              :firstLevel="firstLevel"
            />
          </ul>
        </div>
      </v-flex>
      <v-flex sm4>
        <!-- <v-tabs
          color="white"
          light
          slider-color="purple accent-4"
          fixed-tabs
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
        </div> -->
      </v-flex>

      <alertBox
      :error="error"/>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import PageHeader from './Header.vue'
import LevelService from '../services/LevelService'
import firstlevelComponent from './firstlevelComponent'
import alertBox from './alertBox'
// import ItemService from '../services/ItemService'

export default {
  components: {
    PageHeader,
    firstlevelComponent,
    alertBox
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
    }
  },
  beforeMount () {
    // this.getFirstLevels()
    // console.log(this.firstLevels)
  },
  created () {
    this.getFirstLevels ()
    console.log(this.firstLevels);
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
    async getFirstLevels () {
        // for (let course of this.courses) {
      try {
        let tempFirstLevels = await LevelService.getFirstLevels({
          course: this.currentCourse
        })
        this.firstLevels = Object.keys(tempFirstLevels.data).map((key) => { return tempFirstLevels.data[key]})
      } catch (e) {
        this.error = e.response
      }
        // }
    }
    // logout() {
    //   this.$store.dispatch('setClient', null)
    //   this.$store.dispatch('setToken', null)
    //   this.$store.dispatch('setAdmin', null)
    //   this.$store.dispatch('setUser', null)
    //     .then(() => this.$router.push('/login'))
    // }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0 !important;
  text-align: center;
}
</style>
<style>
/* #admin-layout{
  padding-left: calc(350px + 1%);
}
.v-sidebar-menu.collapsed ~ #admin-layout{
  padding-left: calc(50px + 1%);
} */
.v-tabs__item {
  box-shadow: 0 4px 8px 0 rgba(82,97,115,0.18);
  border-radius: 5px;
}
.v-tabs__item--active {
  background-color: #fff;
}

</style>
