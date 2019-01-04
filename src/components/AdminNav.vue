<template>
    <sidebar-menu id="AdminNav" :class="{'collapsed' : collapsed}" :menu="menu" :collapsed="collapsed" @collapse="onCollapse" :theme="selectedTheme"/>
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu'

export default {
  name: 'adminNav',
  components: {
    SidebarMenu
  },
  data () {
    return {
      menu: [
        {
          header: true,
          title: 'Menu Admin'
        },
        {
          href: '/adminclients',
          title: 'Gestion des clients',
          icon: 'fas fa-minus'
        },
        {
          href: '/admincoachs',
          title: 'Gestion des Coachs',
          icon: '<v-icon small> delete </v-icon>'
        },
        {
          href: '/tables',
          title: 'Gestion des circuits',
          icon: 'fa fa-table',
          child: [
            {
              href: '/auth/login',
              title: 'Login Page',
              icon: 'fa fa-lock'
            },
            {
              href: '/auth/registration',
              title: 'Registration Page',
              icon: 'fa fa-lock'
            }
          ]
        },
        {
          href: '/administration',
          title: 'Administration',
          icon: '<v-icon small> delete </v-icon>'
        }
      ],
      collapsed: true,
      showChild: true,
      theme: ['', 'white-theme'],
      selectedTheme: 'white-theme'
    }
  },
  methods: {
    onCollapse (val) {
      console.log(`collapsed ${val}`)
      this.collapsed = val
    }
  }
}
</script>
<style>
.v-sidebar-menu {
  height: auto !important;
  bottom:0;
  top:0;
  left:0;
  right:0;
  z-index: 42;
}
</style>
<!-- https://github.com/yaminncco/vue-sidebar-menu -->
