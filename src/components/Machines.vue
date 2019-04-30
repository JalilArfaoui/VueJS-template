<template>
  <div>
    <AdminNav />
    <v-layout id="admin-layout">
      <v-flex xs4 md3 id="treeLevel">
        <v-toolbar color="white">
          <v-toolbar-title>Sessions</v-toolbar-title>
        </v-toolbar>
        <v-list>
          <v-list-tile
            v-if="machines"
            v-for="(machineName, index) in machines"
            :key="index"
            class="secondLevelList"
            :class="{ 'activeSL': secondLevel === currentSL }"
          >
            <v-list-tile-content>
              <v-list-tile-title
                class="grey-text"
                @click="showDetails(machineName)"
              >
                {{ machineName }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-btn
                icon
                ripple
                @click="addMachine()"
              >
                <v-icon class="hover-icon" color="grey">add</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import MachinesService from '../services/MachinesService'
import AdminNav from './AdminNav'

export default {
  components: {
    AdminNav
  },
  data () {
    return {
      machines: null
    }
  },
  async created () {
    const response = await MachinesService.fetchMachines();
    // TODO Error
    this.machines = response.data;
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
