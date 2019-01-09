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
        <v-btn slot="activator" color="primary" dark class="mb-2">Ajouter un Niveau</v-btn>
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
                    v-model="editedItem.name"
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
            <v-btn color="blue darken-1" v-if="this.item === 'firstLevel'" flat @click="saveFirstLevel">Valider</v-btn>
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
        color="pink"
        dark
        small
        centered
        fab
        @click="item = 'secondLevel', dialog = true"
      >
        <v-icon>add</v-icon>
      </v-btn>
        <v-card flat
          v-for="(secondLevelId, index) in firstLevel.subLevels"
          :key="secondLevelId">
        <!-- <v-card flat> -->
           <v-container
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
                  <!-- <v-card-actions>
                    <v-btn flat dark>Listen now</v-btn>
                  </v-card-actions> -->
                </v-card>

              </v-flex>
            </v-layout>
          </v-container>
          <v-btn
            color="pink"
            dark
            small
            centered
            fab
            @click="item = 'secondLevel', dialog = true, position = index"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>

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
        <span class="headline">Suppresion d'un client avec utilisateurs</span>
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
        <v-btn color="blue darken-1" flat @click="deleteItem()">Confirmer</v-btn>
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
      deletingItem: {},
      firstLevels: [],
      secondLevels: [],
      item: 'firstLevel',
      itemIndex: '',
      activeFL: 0,
      position: 0,
      editedIndex: -1,
      editedItem: {
        name: ''
      },
      defaultItem: {
        name: ''
      }
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nouveau niveau': 'Modifier le niveau n°'
    },
    levelNum () {
      return this.item === 'firstLevel' ? '1': '2'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  created () {
    this.getFirstLevels()
    this.getSecondLevels()
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
    getSLById (id) {
      return this.secondLevels.find(x => x._id === id)
    },
    getSLNameById (id) {
      return this.secondLevels.find(x => x._id === id).name
    },
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
    async getSecondLevels () {
      try {
        const secondLevels = await LevelService.getSecondLevels()
        this.secondLevels = Object.keys(secondLevels.data).map((key) => {
          return secondLevels.data[key]
        })
      } catch (e) {
        this.error = e.response.data.error
      }
    },
    editFirstLevel (item) {
      this.editedIndex = this.firstLevels.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.item = 'firstLevel'
      this.dialog = true
    },
    editSecondLevel (item) {
      this.editedIndex = this.secondLevels.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.item = 'secondLevel'
      this.dialog = true
    },
    tryDeleteFirstLevel (item) {
      console.log(item);
      if(item.subLevels == 0 || item.subLevels == undefined){
        this.deleteFirstLevel(item)
      } else {
        this.deletingItem = item
        this.deleteFL = true
      }
    },
    async deleteFirstLevel (item) {
      if(item) {
        this.itemIndex = this.firstLevels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        var conf = confirm('Êtes vous sûr de vouloir supprimer ce niveau ?')
      } else {
        this.deleteFL = false
        this.itemIndex = this.firstLevels.indexOf(this.deletingItem)
        this.editedItem = Object.assign({}, this.deletingItem)
        var conf = true
      }
      if (conf) {
        try {
          const deleted = await LevelService.deleteFirstLevel(this.editedItem._id)
          if (deleted) {
            this.firstLevels.splice(this.itemIndex, 1)
          }
        } catch (err) {
          this.error = err.response.data.error
        }

      }
    },
    tryDeleteSecondLevel (item) {
      // if(item.subLevels == 0){
        this.deleteSecondLevel(item)
      // } else {
        // this.deletingItem = item
        // this.deleteSL = true
      // }
    },
    async deleteSecondLevel (item) {
      if(item) {
        this.itemIndex = this.secondLevels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        var conf = confirm('Êtes vous sûr de vouloir supprimer ce niveau ?')
      } else {
        this.deleteSL = false
        this.itemIndex = this.secondLevels.indexOf(this.deletingItem)
        this.editedItem = Object.assign({}, this.deletingItem)
        var conf = true
      }
      if (conf) {
        try {
          const deleted = await LevelService.deleteSecondLevel(this.editedItem._id)
          if (deleted) {
            this.secondLevels.splice(this.itemIndex, 1)
            this.firstLevels[this.activeFL].subLevels.splice(this.firstLevels[this.activeFL].subLevels.indexOf(deleted.data._id), 1)
            // this.firstLevels.find(x => x.subLevels.find(sub => sub == this.editedItem._id)).subLevels.splice(this.itemIndex, 1)
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
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async saveFirstLevel () {
      if (this.editedIndex > -1) {
        try {
          const edited = await LevelService.editFirstLevel({
            _id: this.editedItem._id,
            name: this.editedItem.name
          })
          if (edited) {
            Object.assign(this.firstLevels[this.editedIndex], this.editedItem)
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
            name: this.editedItem.name
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
    async saveSecondLevel () {
      if (this.editedIndex > -1) {
        try {
          const edited = await LevelService.editSecondLevel({
            _id: this.editedItem._id,
            name: this.editedItem.name
          })
          if (edited) {
            Object.assign(this.secondLevels[this.editedIndex], this.editedItem)
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
            name: this.editedItem.name,
            _firstLevel: this.firstLevels[this.activeFL]._id,
            position: this.position + 1
          })
          if (res.data.level) {
            this.secondLevels.push(res.data.level)
            this.firstLevels[this.activeFL].subLevels.splice(this.position + 1, 0, res.data.level._id)
            this.close()
          } else {
            this.dialogError = 'Modification non prise en compte.'
          }
        } catch (error) {
          // this.dialogError = error.response.data.errors
          this.dialogError = 'Impossible de rajouter ce niveau.'
        }
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
</style>
