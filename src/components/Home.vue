<template >
  <div>
    <page-header />
    <v-layout justify-space-around row mt-3 px-5>
      <v-flex sm8>

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
      // name: this.$store.state.user.name,
      name: '',
      dialog: false,
      error: ''
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
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
