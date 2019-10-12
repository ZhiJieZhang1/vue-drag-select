<template>
  <div id="app">
    <ParentCom/>
  </div>
</template>

<script>
import ParentCom from './components/ParentCom'

export default {
  name: 'App',
  components: {
    ParentCom
  }
}
</script>

<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100vw;
  height:100vh;
}
</style>
