<template>
  <div id="app">
    <auth v-show="authVisible" @authDone="authVisible = false"/>
    <menu-main/>
    <router-view></router-view>
  </div>
</template>

<script>
import menuMain from './components/other/Menu'
import auth from './components/other/Auth'

export default {
  components: {
    'menu-main': menuMain,
    auth
  },
  data() {
    return {
      authVisible: true
    }
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
