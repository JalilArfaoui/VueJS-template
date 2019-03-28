<template>
    <sidebar-menu id="AdminNav" @itemClick="onItemClick" :class="{'collapsed' : collapsed}" :menu="menu" :collapsed="collapsed" @collapse="onCollapse" :theme="selectedTheme" />
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
          href: '/',
          title: 'Talk It Easy',
          icon: 'fab fa-pied-piper-hat'
        },
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
                        href: '/admincourse/1',
                        title: 'Niveau 1',
                    },
                    {
                        href: '/admincourse/2',
                        title: 'Niveau 2',
                    },
                    {
                        href: '/admincourse/3',
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
        },
        {
          href: '/login',
          title: 'Deconnexion',
          icon: 'fas fa-sign-out-alt'
        }
      ],
      collapsed: true,
      showChild: true,
      theme: ['', 'white-theme'],
      selectedTheme: 'white-theme'
    }
  },
  methods: {
    onItemClick(event, item) {
      if(item.href == '/login') {
        this.$store.dispatch('setClient', null)
        this.$store.dispatch('setToken', null)
        this.$store.dispatch('setAdmin', null)
        this.$store.dispatch('setUser', null)
          .then(() => this.$router.push('/login'))
      }
    },
    onCollapse (val) {
      // console.log(`collapsed ${val}`)
      this.collapsed = val
    }
  }
}
</script>
<style lang="scss">

// .v-sidebar-menu {
//   height: auto !important;
//   bottom:0;
//   top:0;
//   left:0;
//   right:0;
//   z-index: 42;
//   background-color: $primary !important;
// }
.v-sidebar-menu .vsm-arrow:after{font-family: FontAwesome}
.v-sidebar-menu .collapse-btn:after {
  content: "\f07e";
  font-family: FontAwesome;
}

// .v-sidebar-menu .vsm-item .vsm-icon{
//   color: $secondary !important;
//   background: none !important;
// }
// .v-sidebar-menu.white-theme .vsm-item.first-item.active-item>.vsm-link>.vsm-icon, .v-sidebar-menu.white-theme .vsm-item.first-item.parent-active-item>.vsm-link>.vsm-icon {
//   color: white !important;
// }
.v-sidebar-menu.white-theme .vsm-link{
  color: white !important;
}
.v-sidebar-menu.white-theme .vsm-link:hover{
  background-color: $primary !important;
}
.v-sidebar-menu.white-theme.vsm-default .vsm-link:hover{
  background-color: white !important;
}
.v-sidebar-menu.vsm-default .vsm-link:hover{
  color: $primary !important;
}
.v-sidebar-menu.white-theme .vsm-dropdown>.vsm-list{
  background-color: $secondary !important;
}
.v-sidebar-menu {
  height: auto !important;
  bottom:0;
  top:0;
  left:0;
  right:0;
  z-index: 42;
  background-color: $primary !important;
    // & .vsm-link {
    //     color: $itemColor;
    // }
    // & .vsm-item.mobile-item {
    //     & > .vsm-link {
    //         color: $mobileItemColor;
    //     }
    //     & > .vsm-icon {
    //         color: $mobileIconColor;
    //         background-color: $mobileIconBg;
    //     }
    // }
    & .vsm-item.first-item {
        & > .vsm-link {
            & > .vsm-icon {
              color: $secondary !important;
              background: none !important;
            }
        }
        &.active-item > .vsm-link, &.parent-active-item > .vsm-link {
            box-shadow: 3px 0px 0px 0px $primary inset;
            & > .vsm-icon {
              color: $secondary !important;
              background: none !important;
            }
        }
    }
    &.vsm-default {
        & .vsm-item.first-item {
            &.open-item > .vsm-link {
                color: white !important;
                background-color: $primary !important;
                & > .vsm-icon {
                  color: white !important;
                    // background-color: $iconOpenBg;
                }
            }
        }
        & .vsm-link:hover {
          color: white !important;
          background-color: $primary !important;
        }
    }
    // & .vsm-dropdown {
    //     & > .vsm-list {
    //         background-color: $dropDownBg;
    //         & .vsm-link {
    //             color: $dropDownColor;
    //         }
    //         & .vsm-link:hover {
    //             color: $itemHoverColor;
    //             background-color: $itemHoverBg;
    //         }
    //     }
    // }
    // & .vsm-mobile-bg {
    //     background-color: $mobileItemBg;
    // }
    // & .vsm-header {
    //     color: rgba($itemColor, 0.7);
    // }
    // & .collapse-btn {
    //     color: $itemColor;
    //     background-color: $darkenBg;
    // }
}
</style>
<!-- https://github.com/yaminncco/vue-sidebar-menu -->
