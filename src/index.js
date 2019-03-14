// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import fr from 'vuetify/es5/locale/fr'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import store from './store/store'
import Vuelidate from 'vuelidate'
import './scss/nprogress.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCoffee)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Vue.config.productionTip = false

Vue.use(Vuelidate)
// Vue.use(VueSidebarMenu)
Vue.use(Vuetify, {
  theme: {
    primary: '#198BFF',
    secondary: '#8CBCFF',
    third: '#EF853A',
    accent: '#8c9eff',
    error: '#b71c1c'
  },
  lang: {
    locales: { fr },
    current: 'fr'
  }
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
