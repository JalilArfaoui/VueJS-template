<template>
  <div>
    <v-layout justify-space-around column>
      <!-- <v-layout id="admin-layout" justify-space-around column> -->
      <v-toolbar flat color="white">
        <v-toolbar-title>Circuits</v-toolbar-title>
        <!-- <v-divider
        class="mx-2"
        inset
        vertical
        ></v-divider>
        <v-spacer></v-spacer> -->
      </v-toolbar>
      <v-tabs
        v-model="activeFL"
        centered
        slider-color="blue"
        grow
      >
        <v-tab
        v-for="(firstLevel, index) in firstLevels"
        :key="index"
        ripple
        >
          Niveau {{ index + 1 }}
          </br>
          {{firstLevel.name}}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeFL">
        <v-tab-item
          v-for="(firstLevel, index) in firstLevels"
          :key="index"
        >
        <v-expansion-panel focusable>
          <v-expansion-panel-content
          v-for="(secondLevel, indexSL) in firstLevel.secondLevels"
          :key="indexSL"
          >
            <div
              slot="header"
            >
              {{secondLevel.name}}
            </div>
            <v-card>
              <v-container
                fluid
                grid-list-lg
              >
                <v-layout align-start column fill-height>
                  <v-flex xs4
                    v-for="(item, indexItem) in secondLevel.items"
                    :key="indexItem"
                  >
                    <v-card mt3>
                      <v-card-title primary-title>
                        <div>
                          <div class="headline">{{indexItem}}. {{item.name}}</div>
                          <div v-if="item.type=='Texte Liant'" class="">{{item.content.field}}</div>
                          <div v-else-if="item.type=='Lecture Video'" class="">
                            <VideoPlayer v-bind:activeVideo="item.content.field"></VideoPlayer>
                          </div>
                          <div v-else-if="item.type=='Lecture Audio'" class="">
                            <AudioPlayer v-bind:activeAudio="item.content.field"></AudioPlayer>
                          </div>
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-tab-item>
      </v-tabs-items>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import LevelService from '../services/LevelService'
import VideoPlayer from './videoPlayer'
import AudioPlayer from './audioPlayer'
// import ItemService from '../services/ItemService'

export default {
  components: {
    VideoPlayer,
    AudioPlayer
  },
  data () {
    return {
      name: this.$store.state.user.name,
      dialog: false,
      firstLevels: [],
      secondLevels: [],
      items: [],
      level: 'firstLevel',
      levelIndex: '',
      activeFL: '',
      currentFL: {},
      currentSL: {},
      currentItem: {},
      position: 0,
      positionItem: 0,
      editingIndex: -1,
      editing: {
        name: ''
      },
      defaultlevel: {
        name: ''
      },
      itemTypes: ['Audio Guide', 'Audio Coach', 'Enregistrement Audio', 'Enregistrement Video', 'Lecture Audio', 'Lecture Video', 'Texte Liant', 'Texte Commentaire', 'Test Questionnaire', 'Texte Exercice', 'Photos Exercice', 'Texte Notes', 'Video Coach']
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
    }
  },
  created () {
    this.getFirstLevels()
  },
  mounted () {
    if (localStorage.name) {
      this.name = localStorage.name
    }
    if (localStorage.setUser) {
      this.email = localStorage.setUser
    }
  },
  methods: {
    async getFirstLevels () {
      try {
        const firstLevels = await LevelService.getFirstLevels()
        this.firstLevels = Object.keys(firstLevels.data).map((key) => {
          return firstLevels.data[key]
        })
      } catch (e) {
        this.error = e.response.data.error
      }
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
