<template>
  <div id="app">
    <PdfGraffiti></PdfGraffiti>
  </div>
</template>

<script>
import PdfGraffiti from "./lib/PdfGraffiti.vue";
export default {
  name: "App",
  components: {
    PdfGraffiti,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
