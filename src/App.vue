
<template>
  <div id="app">
    <v-app>
      <page-header />
      <main>
        <!-- <AdminNav /> -->
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </main>
    </v-app>
  </div>
</template>

<script>
import PageHeader from './components/Header.vue'
// import AdminNav from '@/components/AdminNav.vue'
export default {
  name: 'app',
  components: {
    PageHeader
    // AdminNav
  }
}
</script>

<style>
.v-sidebar-menu{
  /* display: none; */
}
main, .v-sidebar-menu{
  margin-top: 56px;
}
@media screen and (min-width: 668px){
  main, .v-sidebar-menu{
    margin-top: 48px;
  }
}
@media screen and (min-width: 992px){
  main, .v-sidebar-menu{
    margin-top: 64px;
  }
}
</style>
