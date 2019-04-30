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
                :value="editing.name"
                label="Nom du niveau"
                autocomplete="false"
                autofocus
                >
              </v-text-field>
              <v-select
                v-if="this.level === 'secondLevel'"
                v-model="editing.category"
                :items="categoryTypes"
                label="Categorie du niveau">
                ></v-select>
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
    <v-flex xs4 md3 id="treeLevel">
      <v-toolbar color="white" >
        <v-toolbar-title>Sessions</v-toolbar-title>
      </v-toolbar>

      <v-expansion-panel
        :value="Array(this.firstLevels.length).fill(true)"
        expand
      >
        <v-expansion-panel-content
          v-for="(firstLevel, index) in firstLevels"
          :key="index"
          class="firstLevelList"
        >
          <template v-slot:header>
            <div class="text-primary firstLevel">
              <h3><v-icon class="text-primary">crop_square</v-icon>
                {{firstLevel.name}}

              </h3>
              <v-btn
                class="hover-icon"
                icon
                ripple
                small
                @click="editFirstLevel(firstLevel)"
              >
                <v-icon color="grey">edit</v-icon>
              </v-btn>
              <v-btn
                class="hover-icon"
                icon
                ripple
                small
                @click="tryDeleteFirstLevel(firstLevel)"
              >
                <v-icon color="grey">delete</v-icon>
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-tile
              v-for="(secondLevel, indexSL) in firstLevel.secondLevels"
              :key="indexSL"
              class="secondLevelList"
              :class="{ 'activeSL': secondLevel === currentSL }"
            >
            <!-- :class="secondLevel.path === $route.path ? 'active-secondlevel' : ''" -->
                <v-list-tile-content>
                  <v-list-tile-title
                    class="grey-text"
                    @click="activeSL(firstLevel, secondLevel)"
                  >
                    <span v-if="secondLevel.category">[{{ secondLevel.category }}] </span>{{ secondLevel.name }}
                  </v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action
                  class="hover-icon-sl"
                >
                  <v-btn icon ripple
                    @click="editSecondLevel(secondLevel)"
                  >
                    <v-icon color="grey">edit</v-icon>
                  </v-btn>
                  <v-btn
                   icon
                   @click="tryDeleteSecondLevel(secondLevel)"
                  >
                    <v-icon color="grey">delete</v-icon>
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

    <v-flex xs8 md9  id="items" v-if="this.currentSL.name">
      <p class="text-primary">
        <b>{{ this.currentFL.name }}></b>{{ this.currentSL.name }}
      </p>
      <!-- <v-tabs
        fixed-tabs
        show-arrows
        justify-space-between
        hide-slider
      > -->
        <!-- <v-tab -->
      <ul>
        <li
          v-for="(item, itemIndex) in this.currentSL.items"
          :key="itemIndex"
          ripple
          class="item text-grey"
          @click="activeItem(item, itemIndex)"
          :class="{ 'active-item': activeIndex === itemIndex }"
        >
          {{item.name}}
        </li>
        <!-- </v-tab>
        <v-tab -->
        <li
          ripple
          active-class="active-item"
          class="text-grey"
        >
          <v-btn
            small
            centered
            fab
            @click="addItem()"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </li>
      </ul>
        <!-- </v-tab>
      </v-tabs> -->
      <v-card v-if="this.currentItem">
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm10>
                <v-text-field
                  v-model="currentItem.name"
                  label="Titre"
                  autocomplete="true"
                  autofocus
                  >
                </v-text-field>
                <v-select
                  v-model="currentItem.type"
                  :items="itemTypes"
                  label="Type">
                  ></v-select>
                <v-text-field
                  v-model="currentItem.consigne"
                  label="Consigne"
                  autocomplete="true"
                  >
                </v-text-field>
                <!-- <div
                  v-for="(content, n) in this.currentItem.content"
                  :key="n"
                > -->
                  <v-select
                    v-model="currentItem.mediaName"
                    :items="medias"
                    label="Média à afficher"
                    item-text="name"
                  ></v-select>
                  <v-radio-group
                    v-model="currentItem.record"
                    row
                    label="L'utilisateur doit-il s'enregistrer ?"
                  >
                    <v-radio label="Non" value="false"></v-radio>
                    <v-radio label="Audio" value="audio"></v-radio>
                    <v-radio label="Video" value="video"></v-radio>
                  </v-radio-group>
                  <!-- <v-checkbox
                    v-model="currentItem.record"
                    label="L'utilisateur doit-il s'enregistrer ?"
                  ></v-checkbox> -->
                <!-- </div> -->

                <v-text-field
                  v-model="currentItem.conclusion"
                  label="Conclusion"
                  autocomplete="true"
                  >
                </v-text-field>
                <v-text-field
                  v-model="currentItem.leftButton"
                  label="Bouton précédent"
                  autocomplete="false"
                  >
                </v-text-field>
                <v-text-field
                  v-model="currentItem.rightButton"
                  label="Bouton suivant"
                  autocomplete="false"
                  >
                </v-text-field>
                <v-btn
                v-if="this.level !== 'newItem'"
                  icon
                  ripple
                  @click="deleteItem(currentItem)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
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
          <v-btn color="blue darken-1" flat v-if="this.level === 'newItem'" @click="saveItem">Ajouter</v-btn>
          <v-btn color="blue darken-1" flat v-else @click="editItem">Valider</v-btn>
        </v-card-actions>
      </v-card>
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
import MediaService from '../services/MediaService'
// import ItemService from '../services/ItemService'

export default {
  components: {
    AdminNav
  },
  data () {
    return {
      activeFL: 0,
      activeIndex: 0,
      currentFL: {},
      currentSL: {},
      currentItem: {},
      course: '',
      categoryTypes: ['Voix', 'Corps', 'Sérénité', 'Détente'],
      defaultlevel: {
        name: ''
      },
      deleteWarning: false,
      deleteFL: false,
      deleteSL: false,
      deletinglevel: {},
      dialog: false,
      dialogError: '',
      error: '',
      editingIndex: -1,
      editing: {
        name: '',
        category: ''
      },
      firstLevels: [],
      items: [],
      itemTypes: ['Audio Guide', 'Audio Coach', 'Enregistrement Audio', 'Enregistrement Video', 'Lecture Audio', 'Lecture Video', 'Texte Liant', 'Texte Commentaire', 'Test Questionnaire', 'Texte Exercice', 'Photos Exercice', 'Texte Notes', 'Video Coach'],
      level: 'firstLevel',
      levelIndex: '',
      medias: [],
      // name: this.$store.state.user.name,
      name: '',
      panel: true,
      // position: 0,
      // positionItem: 0,
      secondLevels: []
    }
  },
  computed: {
    formTitle () {
      return this.editingIndex === -1 ? 'Créer un niveau ': 'Modifier le niveau n°'
    },
    levelNum () {
      return this.level === 'firstLevel' ? '2': '3'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    '$route' (to, from) {
      this.setCourse()
      this.getFirstLevels()
    },
    'currentSL' () {
      // console.log(this.currentSL.name)
    },
    'currentItem' () {
      // console.log(this.currentItem)
    }
  },
  created () {
    // this.getCourseId()
    this.setCourse()
    this.getFirstLevels()
    this.getMedias()
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
    async getMedias () {
      try {
        const medias = await MediaService.getMedias()
        this.medias = Object.keys(medias.data).map((key) => {
          return medias.data[key]
        })
        // this.medias.forEach( media => media.updatedAt = new Date(media.updatedAt).toLocaleDateString("fr-FR"))
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    activeSL(fl,sl) {
      this.currentFL = fl
      this.currentSL = sl
      // this.activeItem(secondLevel.items[0])
      if(this.currentSL.items.length !== 0) {
        this.activeItem(this.currentSL.items[0], 0) // Define the currentItem and add to his content his mediaName
        // this.currentItem = this.currentSL.items[0]
      } else {
        this.currentItem = null
      }
    },
    activeItem(item, activeIndex) {
      // this.level = ''
      this.currentItem = item
      this.activeIndex = activeIndex
      if(this.medias.find(x => x._id == this.currentItem._mediaIn)) {
        this.currentItem.mediaName = this.medias.find(x => x._id == this.currentItem._mediaIn).name
      }
    },
    // activeFirstItem(secondLevel) {
    //   this.activeItem(secondLevel.items[0])
    // },
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
      this.level = 'firstLevel',
      this.editing = {}
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
            this.dialogError = 'Création de niveau non prise en compte.'
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
      this.editing = Object.assign({}, level)
      this.level = 'secondLevel'
      this.dialog = true
    },
    addSecondLevel(firstLevel) {
      this.editing = {}
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
    addItem(){
      // this.currentItem = {}
      this.editingIndex = -1
      this.level = 'newItem'
      this.currentSL.items.push({name: 'Nouveau'}) // Display a new item in the header list
      this.activeItem(this.currentSL.items[this.currentSL.items.length - 1], this.currentSL.items.length - 1)
      // this.currentItem = this.currentSL.items[this.currentSL.items.length - 1]
    },
    editItem () {
      this.editingIndex = 1
      this.saveItem()
    },
    async saveItem () {
      if (this.editingIndex > -1) {
        try {
          if(this.medias.find(x => x._id == this.currentItem._mediaIn)) {
            this.currentItem._mediaIn = this.medias.find(x => x.name == this.currentItem.mediaName)._id
          }
          const editedItem = await LevelService.editItem({
            _id: this.currentItem._id,
            name: this.currentItem.name,
            type: this.currentItem.type,
            consigne: this.currentItem.consigne,
            _mediaIn: this.currentItem._mediaIn,
            record: this.currentItem.record,
            conclusion: this.currentItem.conclusion,
            leftButton: this.currentItem.leftButton,
            rightButton: this.currentItem.rightButton,
          })
          if (editedItem) {
            Object.assign(this.currentItem, editedItem)
            this.editingIndex = -1
            this.close()
          } else {
            this.dialogError = 'Modifications non prise en compte.'
          }
        } catch (error) {
          // this.dialogError = error.response
          this.dialogError = 'Modification non prise en compte.'
        }
      } else {
        try {
          const res = await LevelService.createItem({
            _id: this.currentItem._id,
            name: this.currentItem.name,
            type: this.currentItem.type,
            consigne: this.currentItem.consigne,
            _mediaIn: this.currentItem._mediaIn,
            record: this.currentItem.record,
            conclusion: this.currentItem.conclusion,
            leftButton: this.currentItem.leftButton,
            rightButton: this.currentItem.rightButton,
            _secondLevel: this.currentSL._id
            // position: this.positionItem
          })
          if (res.data.firstlevel) {
            this.firstLevels.find(x => x._id === res.data.firstlevel._id).secondLevels = res.data.firstlevel.secondLevels
            this.currentSL.items.pop() // Remove the "Nouveau" item in the header list
            this.currentSL = res.data.firstlevel.secondLevels.find(x => x._id === this.currentSL._id)
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
            this.currentSL = deleted.data.secondlevel
            this.firstLevels.find(x => x._id === deleted.data.firstlevel._id).secondLevels = deleted.data.firstlevel.secondLevels
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
      this.editing = ''
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
#treeLevel {
  overflow-y: scroll;
  position: absolute;
  top: 0px;
  bottom: 0;
  min-width: 256px;
}
#items{
  padding-left: 2em;
  padding-right: 2em;
  width: 100%;
  margin-left: auto;
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
  cursor: pointer;
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
.firstLevel{
  white-space: nowrap;
  display: flex;
  & h3 {
    overflow: auto;
    text-overflow: ellipsis;
  }
}
.v-btn--icon.v-btn--small {
  margin: 0 1px;
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
  padding: 10px 30px;
  cursor: pointer;
}
.v-list__tile__title{
  transition: none;
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
  color: $primary !important;
  font-weight: bolder;
}
.activeSL {
  color: $primary !important;
  font-weight: bolder;
  background-color: #ECF6FF;
  border-radius: 30px;
  margin: 0px 10px;
  transition: .4s cubic-bezier(.25,.8,.5,1);
}
.v-btn--small {
  height: 2em;
}
</style>
