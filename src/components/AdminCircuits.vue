<template>
  <div>
  <AdminNav />
  <v-layout id="admin-layout" justify-space-around column>
    <v-toolbar flat color="white">
      <v-toolbar-title>Circuits</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn
          slot="activator"
          color="blue"
          dark
          class="mb-2"
          @click="level = 'firstLevel', editingIndex = -1"
        >
          Ajouter un Niveau
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }} {{ levelNum }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm10>
                  <v-text-field
                    v-if=""
                    v-model="editinglevel.name"
                    label="Nom du niveau">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-alert
              v-if='dialogError'
              :value="dialogError"
              type="error"
              dismissible
              icon="warning"
              color="error"
              outline
              >
              {{dialogError}}
            </v-alert>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
            <v-btn color="blue darken-1" v-if="this.level === 'firstLevel'" flat @click="saveFirstLevel">Valider</v-btn>
            <v-btn color="blue darken-1" v-else flat @click="saveSecondLevel">Valider</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        <v-btn
          fab
          small
          color="transparent"
          @click="editFirstLevel(firstLevel)"
          >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          color="transparent"
          @click="tryDeleteFirstLevel(firstLevel)"
          >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>


  <v-tabs-items v-model="activeFL">
      <v-tab-item
        v-for="(firstLevel, index) in firstLevels"
        :key="index"
      >
      <v-btn
        color="blue"
        dark
        small
        centered
        fab
        @click="level = 'secondLevel', dialog = true"
      >
        <v-icon>add</v-icon>
      </v-btn>
        <!-- <v-card flat -->
        <v-toolbar
          color="pink"
          dark
          v-for="(secondLevel, index) in firstLevel.secondLevels"
          :key="secondLevel._id"
        >

          <v-toolbar-title>{{secondLevel}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon
          @click="editSecondLevel(secondLevel)"
            >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon
            @click="tryDeleteSecondLevel(secondLevel)"
            >
            <v-icon>delete</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- <v-card>
          <v-container
            fluid
            grid-list-lg
          >
            <v-layout row wrap>
              <v-flex xs12
                v-for="(item, index) in secondLevel.items"
                :key="item"
              >
                <v-card color="blue-grey darken-2" class="white--text">
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">{{getItemById(itemId)}}</div>
                    </div>
                  </v-card-title>
                </v-card>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card> -->
           <!-- <v-container
            fluid
            grid-list-lg
            >
            <v-layout row wrap>
              <v-flex xs12 lg6>
                <v-card color="blue darken-2" class="white--text">
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">{{getSLNameById(secondLevelId)}}</div>
                    </div>
                    <v-btn
                      fab
                      small
                      dark
                      color="transparent"
                      @click="editSecondLevel(getSLById(secondLevelId))"
                      >
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      small
                      dark
                      color="transparent"
                      @click="tryDeleteSecondLevel(getSLById(secondLevelId))"
                      >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-card-title>
                </v-card>

              </v-flex>
            </v-layout>
          </v-container> -->
          <v-btn
            color="blue"
            dark
            small
            centered
            fab
            @click="level = 'secondLevel', dialog = true, position = index"
          >
            <v-icon>add</v-icon>
          </v-btn>
        <!-- </v-card> -->

      </v-tab-item>
    </v-tabs-items>
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
  <v-dialog v-model="deleteFL" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Suppresion d'un niveau avec dépendances</span>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if='deleteFL'
          :value="deleteFL"
          type="error"
          icon="warning"
          color="error"
          outline
          >
          Vous vous apprétez à supprimer un niveau qui contient des sous-niveaux. Si vous poursuivez, tous ces sous-niveaux seront également supprimé.
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
        <v-btn color="red darken-1" v-if="this.level === 'firstLevel'" flat @click="deleteFirstLevel">Supprimer</v-btn>
        <v-btn color="red darken-1" v-else flat @click="deleteSecondLevel">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</div>
</template>

<script>
/* eslint-disable no-useless-escape */
import AdminNav from './AdminNav'
import LevelService from '../services/LevelService'
import ItemService from '../services/ItemService'

export default {
  components: {
    // Panel,
    AdminNav
  },
  data () {
    return {
      name: this.$store.state.user.name,
      dialog: false,
      error: '',
      dialogError: '',
      deleteFL: false,
      deleteSL: false,
      deletinglevel: {},
      firstLevels: [],
      secondLevels: [],
      items: [],
      level: 'firstLevel',
      levelIndex: '',
      activeFL: 0,
      currentFL: {},
      currentSL: {},
      currentItem: {},
      position: 0,
      editingIndex: -1,
      editinglevel: {
        name: ''
      },
      defaultlevel: {
        name: ''
      }
    }
  },
  computed: {
    formTitle () {
      return this.editingIndex === -1 ? 'Nouveau niveau': 'Modifier le niveau n°'
    },
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
    },
    editFirstLevel (level) {
      this.editingIndex = this.firstLevels.indexOf(level)
      this.editinglevel = Object.assign({}, level)
      this.level = 'firstLevel'
      this.dialog = true
    },
    async saveFirstLevel () {
      if (this.editingIndex > -1) {
        try {
          const editing = await LevelService.editFirstLevel({
            _id: this.editinglevel._id,
            name: this.editinglevel.name
          })
          if (editing) {
            Object.assign(this.firstLevels[this.editingIndex], this.editinglevel)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte.'
          }
        } catch (e) {
          this.dialogError = 'Modification non prise en compte.'
        }
      } else {
        try {
          const res = await LevelService.createFirstLevel({
            name: this.editinglevel.name
          })
          if (res.data.firstLevel.name) {
            this.firstLevels.push(res.data.firstLevel)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte.'
          }
        } catch (error) {
          // this.dialogError = error.response.data.errors
          this.dialogError = 'Impossible de rajouter ce niveau.'
        }
      }
    },
    editSecondLevel (level) {
      this.currentFL = this.firstLevels.find(x => x.secondLevels.find(x => x._id === level._id))
      this.editingIndex = this.currentFL.secondLevels.indexOf(level)
      this.editinglevel = Object.assign({}, level)
      this.level = 'secondLevel'
      this.dialog = true
    },
    async saveSecondLevel () {
      if (this.editingIndex > -1) {
        try {
          const editing = await LevelService.editSecondLevel({
            _id: this.editinglevel._id,
            name: this.editinglevel.name
          })
          if (editing) {
            Object.assign(this.currentFL.secondLevels[this.editingIndex], this.editinglevel)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte.'
          }
        } catch (e) {
          this.dialogError = 'Modification non prise en compte.'
        }
      } else {
        try {
          const res = await LevelService.createSecondLevel({
            name: this.editinglevel.name,
            _firstLevel: this.firstLevels[this.activeFL]._id,
            position: this.position
          })
          if (res.data.firstlevel) {
            // this.secondLevels.push(res.data.level)
            this.firstLevels.find(x => x._id === res.data.firstlevel._id).secondLevels = res.data.firstlevel.secondLevels
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte.'
          }
        } catch (error) {
          // this.dialogError = error.response.data.errors
          this.dialogError = 'Impossible de rajouter ce niveau.'
        }
      }
    },
    tryDeleteFirstLevel (level) {
      if(level.secondLevels == 0 || level.secondLevels == undefined){
        this.deleteFirstLevel(level)
      } else {
        this.deletinglevel = level
        this.deleteFL = true
      }
    },
    async deleteFirstLevel (level) {
      if(!this.deleteFL) {
        this.levelIndex = this.firstLevels.indexOf(level)
        this.editinglevel = Object.assign({}, level)
        var conf = confirm('Êtes vous sûr de vouloir supprimer ce niveau ?')
      } else {
        this.deleteFL = false
        this.levelIndex = this.firstLevels.indexOf(this.deletinglevel)
        this.editinglevel = Object.assign({}, this.deletinglevel)
        var conf = true
      }
      if (conf) {
        try {
          const deleted = await LevelService.deleteFirstLevel(this.editinglevel._id)
          if (deleted) {
            this.firstLevels.splice(this.levelIndex, 1)
          }
        } catch (err) {
          this.error = err.response.data.error
        }

      }
    },
    tryDeleteSecondLevel (level) {
      // if(level.subLevels == 0){
        this.deleteSecondLevel(level)
      // } else {
        // this.deletinglevel = level
        // this.deleteSL = true
      // }
    },
    async deleteSecondLevel (level) {
      if(!this.deleteSL) {
        var firstLevel = this.firstLevels.find(x => x.secondLevels.find(x => x._id === level._id))
        this.levelIndex = firstLevel.secondLevels.indexOf(level)
        // this.editinglevel = Object.assign({}, level)
        var conf = confirm('Êtes vous sûr de vouloir supprimer ce niveau ?')
      } else {
        this.deleteSL = false
        this.levelIndex = this.secondLevels.indexOf(this.deletinglevel)
        this.editinglevel = Object.assign({}, this.deletinglevel)
        var conf = true
      }
      if (conf) {
        try {
          const deleted = await LevelService.deleteSecondLevel(level._id)
          console.log(deleted.data)
          if (deleted) {
            this.firstLevels.find(x => x._id === deleted.data._id).secondLevels.splice(this.levelIndex, 1)
          }
        } catch (error) {
          this.dialogError = error.response.data.errors
        }
      }
    },
    close () {
      this.dialog = false
      this.dialogError = ''
      setTimeout(() => {
        this.editinglevel = Object.assign({}, this.defaultlevel)
        this.editingIndex = -1
      }, 300)
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
</style>
