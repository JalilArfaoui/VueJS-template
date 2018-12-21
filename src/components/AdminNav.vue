<template>
    <sidebar-menu id="AdminNav" :class="{'collapsed' : collapsed}" :menu="menu" :collapsed="collapsed" @collapse="onCollapse" />
</template>

<script>
export default {
  data () {
    return {
      menu: [
        {
          header: true,
          title: 'Main Navigation'
        },
        {
          href: '/adminclients',
          title: 'Gestion des clients',
          icon: 'fa fa-user'
        },
        {
          href: '/charts',
          title: 'Gestion des Profils coachs',
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
        }
      ],
      collapsed: true,
      showChild: true
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
