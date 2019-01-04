import Vue from 'vue'
import Router from 'vue-router'
import store from './../store/store.js'

import Home from '../components/Home'
import Login from '../components/Login'
import Welcome from '../components/Welcome.vue'
import ResetPwd from '../components/ResetPwd.vue'
import Dashboard from '../components/Dashboard.vue'
import MediaCapture from '../components/MediaCapture.vue'

import Admin from '../components/Admin.vue'
import AdminClients from '../components/AdminClients.vue'
import AdminDetailsClient from '../components/AdminDetailsClient.vue'
import AdminUsers from '../components/AdminUsers.vue'
import AdminCoachs from '../components/AdminCoachs.vue'
import Administration from '../components/Administration.vue'

Vue.use(Router)

// export default new Router({
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/resetPwd',
      name: 'resetPwd',
      component: ResetPwd
    },
    {
      path: '/mediacapture',
      name: 'mediacapture',
      component: MediaCapture,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminclients',
      name: 'adminclients',
      component: AdminClients,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/admindetailsclient',
      name: 'admindetailsclient',
      component: AdminDetailsClient,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminusers',
      name: 'adminusers',
      component: AdminUsers,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/admincoachs',
      name: 'admincoachs',
      component: AdminCoachs,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/administration',
      name: 'administration',
      component: Administration,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.isUserLoggedIn) {
      if (to.matched.some(record => record.meta.requiresAdminAuth)) {
        if (store.state.isUserAdmin) {
          next()
          return
        }
        next({ path: '/dashboard', query: { authAdminRequired: true } })
      }
      next()
      return
    }
    next({ path: '/login', query: { authRequired: true } })
  } else {
    next()
  }
})

export default router
