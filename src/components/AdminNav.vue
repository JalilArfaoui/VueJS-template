<template>
    <sidebar-menu id="AdminNav" :class="{'collapsed' : collapsed}" :menu="menu" :collapsed="collapsed" @collapse="onCollapse" :theme="selectedTheme"/>
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

export default {
  name: 'adminNav',
  components: {
    SidebarMenu
  },
  data () {
    return {
      menu: [
        // {
        //   header: false,
        //   title: 'Menu Admin'
        // },
        {
          href: '/adminclients',
          title: 'Gestion des clients',
          icon: 'fas fa-minus'
        },
        {
          href: '/admincoachs',
          title: 'Gestion des Coachs',
          icon: 'fas fa-user'
        },
        {
          href: '/admincircuits',
          title: 'Gestion des circuits',
          icon: 'fas fa-igloo'
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
  background-color: #00bcd4 !important;
}
.v-sidebar-menu .vsm-arrow:after{font-family: FontAwesome}
.v-sidebar-menu .collapse-btn:after {
content: "\f07e";
font-family: FontAwesome;
}
</style>
<!-- https://github.com/yaminncco/vue-sidebar-menu -->
