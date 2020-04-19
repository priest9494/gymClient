<template>
  <div id="app">
    <menu-main/>
    <router-view></router-view>
  </div>
</template>

<script>
import menuMain from './components/other/Menu'

export default {
  components: {
    'menu-main': menuMain
  },
  name: 'main'
}
</script>

<style>
body {
  margin: 0;
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
