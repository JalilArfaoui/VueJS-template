<template>
    <sidebar-menu id="AdminNav" :class="{'collapsed' : collapsed}" :menu="menu" :collapsed="collapsed" @collapse="onCollapse" :theme="selectedTheme"/>
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import '@fortawesome/fontawesome-free/css/all.css'
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
          icon: 'fas fa-users'
        },
        {
          href: '/admincoachs',
          title: 'Gestion des Coachs',
          icon: 'fas fa-user-astronaut'
        },
        {
          title: 'Gestion des circuits',
          icon: 'fas fa-route',
          child: [
                    {
                        href: '/AdminNiveau1',
                        title: 'Niveau 1',
                    },
                    {
                        href: '/AdminNiveau2',
                        title: 'Niveau 2',
                    },
                    {
                        href: '/AdminNiveau3',
                        title: 'Niveau 3',
                    },
                ]
        },
        {
          href: '/adminmedias',
          title: 'Gestion des médias',
          icon: 'fas fa-film'
        },
        {
          href: '/administration',
          title: 'Administration',
          icon: 'fas fa-gopuram'
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
