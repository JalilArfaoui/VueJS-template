<template>
  <li class="mb-5">
    <h2 class="shadow-1 mx-25">{{ firstLevel.name }}</h2>
    <v-layout row wrap justify-center>
    <!-- <v-flex d-flex class="lvl3"> -->
      <v-flex
        v-for="(secondLevel,i) in firstLevel.secondLevels"
        :key="i"
        @click="toExercices(secondLevel)"
        class="pointer"
        xs4
        mt-4
      >
        <v-img
          src="../assets/rocket.svg"
          contain
          class="disc shadow-1 br-5"
          width="50%"
        ></v-img>
        {{ secondLevel.name }}

      <!-- </div> -->
      </v-flex>
    <!-- </v-flex> -->
    </v-layout>
  </li>
</template>

<script>
import videoPlayer from './videoPlayer'

export default {
  components: {
    videoPlayer
  },
  props: {
    firstLevel: {
      type: Object,
      required: true
    }
  },
  methods: {
    toExercices (secondLevel) {
      this.$store.dispatch('setSL', secondLevel)
        .then(() => this.$router.push('/exercises'))
    }
  }
}
</script>
<style>
ul {
  list-style: none;
  padding: 0 !important;
}
</style>
