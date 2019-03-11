import Vue from 'vue'
import Router from 'vue-router'
import store from './../store/store.js'
import NProgress from 'nprogress'

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
import AdminNiveau1 from '../components/AdminNiveau1.vue'
import AdminNiveau2 from '../components/AdminNiveau2.vue'
import AdminNiveau3 from '../components/AdminNiveau3.vue'
import AdminMedias from '../components/AdminMedias.vue'

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
      path: '/home',
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
    },
    {
      path: '/adminniveau1',
      name: 'adminniveau1',
      component: AdminNiveau1,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminniveau2',
      name: 'adminniveau2',
      component: AdminNiveau2,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminniveau3',
      name: 'adminniveau3',
      component: AdminNiveau3,
      meta: {
        requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminmedias',
      name: 'adminmedias',
      component: AdminMedias,
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

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
