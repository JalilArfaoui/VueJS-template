<template>
  <div>
  <AdminNav />
  <v-dialog v-model="dialog" max-width="500px">
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
                v-model="editing.name"
                label="Nom du niveau">
              </v-text-field>
              <v-text-field
                v-if="this.level === 'secondLevel'"
                v-model="editing.category"
                label="Categorie du sous-niveau">
              </v-text-field>
              <v-select
                v-if="this.level === 'itemCreation'"
                v-model="editing.type"
                :items="itemTypes"
                item-text="state"
                item-value="abbr"
                label="Type d'item"
                persistent-hint
                return-object
                single-line
              ></v-select>
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
        <v-btn color="blue darken-1" v-else-if="this.level === 'secondLevel'" flat @click="saveSecondLevel">Valider</v-btn>
        <v-btn color="blue darken-1" v-else flat @click="saveItem">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-layout id="admin-layout">
    <v-flex xs3>
    <!-- <v-toolbar flat color="white">
      <v-toolbar-title>{{this.course}}</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
        <v-btn
          slot="activator"
          color="blue"
          dark
          class="mb-2"
          @click="level = 'firstLevel', editingIndex = -1"
        >
          Ajouter un Niveau
        </v-btn>
      </v-toolbar> -->

    <v-toolbar color="white" >
            <v-toolbar-title>{{this.course}}</v-toolbar-title>
    </v-toolbar>
    <v-expansion-panel
      value=true
    >
      <v-expansion-panel-content
        v-for="(firstLevel, index) in firstLevels"
        :key="index"
        class="firstLevelList"
      >
        <template v-slot:header>
          <div class="text-primary">
            <v-icon class="text-primary">crop_square</v-icon>
            {{firstLevel.name}}
            <v-btn
              icon
              ripple
              small
              @click="editFirstLevel(firstLevel)"
              >
              <v-icon class="hover-icon" color="grey">edit</v-icon>
            </v-btn>
            <v-btn
              icon
              ripple
              small
              @click="tryDeleteFirstLevel(firstLevel)"
              >
              <v-icon class="hover-icon" color="grey">delete</v-icon>
            </v-btn>
          </div>
        </template>
        <v-list>
          <v-list-tile
            v-for="(secondLevel, indexSL) in firstLevel.secondLevels"
            :key="indexSL"
            @click=""
            class="secondLevelList"
          >
          <!-- :class="secondLevel.path === $route.path ? 'active-secondlevel' : ''" -->
              <v-list-tile-content>
                <v-list-tile-title class="grey-text" @click="activeSL(firstLevel, secondLevel)"><span v-if="secondLevel.category">[{{ secondLevel.category }}] </span>{{ secondLevel.name }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon ripple
                @click="editSecondLevel(secondLevel)">
                  <v-icon class="hover-icon-sl" color="grey">edit</v-icon>
                </v-btn>
                <v-btn icon
                  @click="tryDeleteSecondLevel(secondLevel)"
                  >
                  <v-icon class="hover-icon-sl" color="grey">delete</v-icon>
                </v-btn>
              </v-list-tile-action>

          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-btn
                icon
                ripple
                @click="addSecondLevel(firstLevel)"
              >
                <v-icon class="hover-icon" color="grey">add</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

      </v-expansion-panel-content>
      <v-btn
        icon
        ripple
        @click="addFirstLevel()"
        >
        <v-icon color="blue">add</v-icon>
      </v-btn>
    </v-expansion-panel>
</v-flex>

<v-flex xs-9  v-if="this.currentSL">
  <p class="text-primary">
    <b>{{ this.currentFL.name }}></b>{{ this.currentSL.name }}
  </p>
  <v-tabs
    fixed-tabs
    show-arrows
    justify-space-between
    hide-slider
  >
    <v-tab
      v-for="item in this.currentSL.items"
      :key="n"
      ripple
      active-class="active-item"
      class="item text-grey"
    >
      <!-- <v-btn class="item text-grey"> -->
        {{item.name}}
        <v-btn
          icon
          ripple
          @click="editItem(item)"
          class="hover-icon-item"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          icon
          ripple
          @click="deleteItem(item)"
          class="hover-icon-item"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      <!-- </v-btn> -->
    </v-tab>
    <v-tab
      ripple
      active-class="active-item"
      class="item text-grey"
    >
      <v-btn
        small
        centered
        fab
        @click="addItem()"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-tab>
  </v-tabs>
</v-flex>
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
  <v-dialog v-model="deleteWarning" max-width="500px">
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
        <v-alert
          v-if='deleteSL'
          :value="deleteSL"
          type="error"
          icon="warning"
          color="error"
          outline
          >
          Vous vous apprétez à supprimer un sous-niveau qui contient des items. Si vous poursuivez, tous ces items seront également supprimé.
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Annuler</v-btn>
        <v-btn color="red darken-1" v-if="this.deleteFL" flat @click="deleteFirstLevel">Supprimer</v-btn>
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
// import ItemService from '../services/ItemService'

export default {
  components: {
    // Panel,
    AdminNav
  },
  data () {
    return {
      panel: true,
      name: this.$store.state.user.name,
      course: '',
      dialog: false,
      error: '',
      dialogError: '',
      deleteWarning: false,
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
      positionItem: 0,
      editingIndex: -1,
      editing: {
        name: '',
        category: ''
      },
      defaultlevel: {
        name: ''
      },
      itemTypes: ['Audio Guide', 'Audio Coach', 'Enregistrement Audio', 'Enregistrement Video', 'Lecture Audio', 'Lecture Video', 'Texte Liant', 'Texte Commentaire', 'Test Questionnaire', 'Texte Exercice', 'Photos Exercice', 'Texte Notes', 'Video Coach']
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
    },
    '$route' (to, from) {
      this.setCourse()
      this.getFirstLevels()
    }
  },
  created () {
    // this.getCourseId()
    this.setCourse()
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
    addItem(){
      this.level = 'itemCreation'
      this.dialog = true
    },
    activeSL(fl,sl) {
      this.currentFL = fl
      this.currentSL = sl

    },
    setCourse() {
      this.course = 'Niveau ' + this.$route.params.level
    },
    async getFirstLevels () {
      try {
        const firstLevels = await LevelService.getFirstLevels({
          course: this.course
        })
        this.firstLevels = Object.keys(firstLevels.data).map((key) => {
          return firstLevels.data[key]
        })
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    editFirstLevel (level) {
      this.editingIndex = this.firstLevels.indexOf(level)
      this.editing = Object.assign({}, level)
      this.level = 'firstLevel'
      this.dialog = true
    },
    addFirstLevel() {
      this.dialog = true,
      this.level = 'firstLevel'
    },
    async saveFirstLevel () {
      if (this.editingIndex > -1) {
        try {
          const editing = await LevelService.editFirstLevel({
            _id: this.editing._id,
            name: this.editing.name
          })
          if (editing) {
            Object.assign(this.firstLevels[this.editingIndex], this.editing)
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
            name: this.editing.name,
            course: this.course
          })
          if (res.data.firstLevel.name) {
            this.firstLevels.push(res.data.firstLevel)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte.'
          }
        } catch (error) {
          this.dialogError = error.response.data.errors
          // this.dialogError = 'Impossible de rajouter ce niveau.'
        }
      }
    },
    editSecondLevel (level) {
      this.currentFL = this.firstLevels.find(x => x.secondLevels.find(x => x._id === level._id))
      this.editingIndex = this.currentFL.secondLevels.indexOf(level)
      this.editing = Object.assign({}, level)
      this.level = 'secondLevel'
      this.dialog = true
    },
    addSecondLevel(firstLevel) {
      this.dialog = true,
      this.level = 'secondLevel'
      this.currentFL = firstLevel
    },
    async saveSecondLevel () {
      if (this.editingIndex > -1) {
        try {
          const editing = await LevelService.editSecondLevel({
            _id: this.editing._id,
            name: this.editing.name,
            category: this.editing.category
          })
          if (editing) {
            Object.assign(this.currentFL.secondLevels[this.editingIndex], this.editing)
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
            name: this.editing.name,
            // _firstLevel: this.firstLevels[this.activeFL]._id,
            _firstLevel: this.currentFL._id,
            category: this.editing.category
            // position: this.position
          })
          if (res.data.firstlevel) {
            // console.log(this.activeFL)
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
    editItem (item) {
      this.currentFL = this.firstLevels.find(x => x.secondLevels.find(x => x.items.find(x => x._id === item._id)))
      this.currentSL = this.currentFL.secondLevels.find(x => x.items.find(x => x._id === item._id))
      this.editingIndex = this.currentSL.items.indexOf(item)
      this.editing = Object.assign({}, item)
      this.level = 'item'
      this.dialog = true
    },
    async saveItem () {
      if (this.editingIndex > -1) {
        try {
          const editing = await LevelService.editItem({
            _id: this.editing._id,
            name: this.editing.name
          })
          if (editing) {
            Object.assign(this.currentSL.items[this.editingIndex], this.editing)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte.'
          }
        } catch (e) {
          this.dialogError = 'Modification non prise en compte.'
        }
      } else {
        try {
          const res = await LevelService.createItem({
            name: this.editing.name,
            type: this.editing.type,
            _secondLevel: this.currentSL._id,
            // position: this.positionItem
          })
          if (res.data.secondlevel) {
            console.log(res.data.secondlevel);
            // this.firstLevels.find(x => x._id === res.data.firstlevel._id).secondLevels = res.data.firstlevel.secondLevels
            this.currentSL = res.data.secondlevel
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
        this.deleteWarning = true
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
        this.deleteWarning = false
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
      if(level.items == 0){
        this.deleteSecondLevel(level)
      } else {
        this.deletinglevel = level
        this.deleteWarning = true
        this.deleteSL = true
      }
    },
    async deleteSecondLevel (level) {
      if(!this.deleteSL) {
        var firstLevel = this.firstLevels.find(x => x.secondLevels.find(x => x._id === level._id))
        this.levelIndex = firstLevel.secondLevels.indexOf(level)
        this.editinglevel = Object.assign({}, level)
        var conf = confirm('Êtes vous sûr de vouloir supprimer ce sous-niveau ?')
      } else {
        this.deleteSL = false
        this.deleteWarning = false
        this.levelIndex = this.secondLevels.indexOf(this.deletinglevel)
        this.editinglevel = Object.assign({}, this.deletinglevel)
        var conf = true
      }
      if (conf) {
        try {
          const deleted = await LevelService.deleteSecondLevel(this.editinglevel._id)
          if (deleted) {
            this.firstLevels.find(x => x._id === deleted.data._id).secondLevels.splice(this.levelIndex, 1)
          }
        } catch (error) {
          this.dialogError = error.response.data.errors
        }
      }
    },
    async deleteItem (item) {
      var conf = confirm('Êtes vous sûr de vouloir supprimer cet item ?')
      if (conf) {
        try {
          const deleted = await LevelService.deleteItem(item._id)
          if (deleted) {
            this.firstLevels.find(x => x._id === deleted.data._id).secondLevels = deleted.data.secondLevels
          }
        } catch (error) {
          this.dialogError = error.response.data.errors
        }
      }
    },
    close () {
      this.dialog = false
      this.deleteFL = false
      this.deleteSL = false
      this.dialogError = ''
      setTimeout(() => {
        this.editinglevel = Object.assign({}, this.defaultlevel)
        this.editingIndex = -1
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>

#admin-layout{
  padding-left: calc(350px + 1%);
}
.v-sidebar-menu.collapsed ~ #admin-layout{
  /* padding-left: calc(50px + 1%); */
  padding-left: 50px;
}
.v-toolbar{
  box-shadow: none;
}
.firstLevelList {
  padding-left: 2em;
  padding-right: 2em;

  .hover-icon{
    display: none;
  }
  &:hover .hover-icon{
    display: block;
  }
}
.secondLevelList {
  .hover-icon-sl{
    display: none;
  }
  &:hover .hover-icon-sl{
    display: block;
  }
}
.item {
  .hover-icon-item{
    display: none;
  }
  &:hover .hover-icon-item{
    display: block;
  }
}

.theme--light.v-list .v-list__group--active:after, .theme--light.v-list .v-list__group--active:before {
  background: none !important;
}
ul {
  list-style-type: none;
  display: flex;
}
.item{
  background-color: #ECF6FF !important;
  margin: auto !important;
  border-radius: 20px;
}

</style>

<style lang="scss">
.v-tabs__bar.theme--light {
  background: none !important;
}
.v-list__tile__action--stack{
  flex-direction: row;
}
.active-item{
  color: $primary;
  font-weight: bolder;
}
</style>
