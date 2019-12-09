<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
	@import './assets/scss/reset';
	@import './assets/scss/common';
#app {
  width: 100%;
  height: 100%;
}
</style>
