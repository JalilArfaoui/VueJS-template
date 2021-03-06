import Vue from 'vue'
import Router from 'vue-router'
// import store from './../store/store.js'
import NProgress from 'nprogress'

// import Home from '../components/Home'
import Login from '../components/Login'
import Machines from '../components/Machines'
import Welcome from '../components/Welcome.vue'
import ResetPwd from '../components/ResetPwd.vue'
import MediaCapture from '../components/MediaCapture.vue'
import Exercises from '../components/Exercises.vue'

import Admin from '../components/Admin.vue'
import AdminClients from '../components/AdminClients.vue'
import AdminDetailsClient from '../components/AdminDetailsClient.vue'
import AdminUsers from '../components/AdminUsers.vue'
import AdminCoachs from '../components/AdminCoachs.vue'
import Administration from '../components/Administration.vue'
import AdminCourse from '../components/AdminCourse.vue'
import AdminMedias from '../components/AdminMedias.vue'

import NotFound from '../components/404.vue'

Vue.use(Router)

// export default new Router({
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/machines'
    },
    {
      path: '/machines',
      name: 'machines',
      component: Machines
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
      path: '/exercises',
      name: 'exercises',
      component: Exercises,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminclients',
      name: 'adminclients',
      component: AdminClients,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/admindetailsclient',
      name: 'admindetailsclient',
      component: AdminDetailsClient,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminusers',
      name: 'adminusers',
      component: AdminUsers,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/admincoachs',
      name: 'admincoachs',
      component: AdminCoachs,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/administration',
      name: 'administration',
      component: Administration,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/admincourse/:level',
      component: AdminCourse,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      path: '/adminmedias',
      name: 'adminmedias',
      component: AdminMedias,
      meta: {
        // requiresAuth: true,
        requiresAdminAuth: true
      }
    },
    {
      // MUST BE THE LAST cause it will match everything left
      path: '*',
      component: NotFound
    }
  ]
})

// Before each route, check if user is Logged and/or is Admin
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (store.state.isUserLoggedIn) {
//       next()
//       return
//     }
//     next({ path: '/login', query: { authRequired: true } })
//   } else if (to.matched.some(record => record.meta.requiresAdminAuth)) {
//     if (store.state.isUserLoggedIn && store.state.isUserAdmin) {
//       next()
//       return
//     }
//     next({ path: '/', query: { authAdminRequired: true } })
//   } else {
//     next()
//   }
// })

// Launch a loading bar each time a route is called
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
