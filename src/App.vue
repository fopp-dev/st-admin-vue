<template>
  <div id="app">
    <router-view/>
    <login></login>
  </div>
</template>

<script>
import Login from './components/Login'

export default {
  name: 'App',
  data () {
    return {
      contentStyleObj: {
        height: ''
      }
    }
  },
  components: {
    Login
  },
  created () {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  },
  mounted () {},
  methods: {
    getHeight () {
      this.contentStyleObj.height = window.innerHeight + 'px'
    }
  }
}
</script>

<style>
  #app {
    font-family: "Microsoft Yahei", 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #000;
  }
</style>
