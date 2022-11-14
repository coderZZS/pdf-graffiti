<template>
  <div id="app">
    <PdfGraffiti
      :pdfUrl="pdfurl"
      :isEdit.sync="isEdit"
      v-model="pdfData"
      ref="pdfVue"
    ></PdfGraffiti>
    <button @click="save">保存</button>
  </div>
</template>

<script>
const url =
  "https://coke-1304800772.cos.ap-chongqing.myqcloud.com/test/01%E3%80%81beego%20%E7%AE%80%E4%BB%8B%20%E4%BB%A5%E5%8F%8Abeego%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E3%80%81bee%E8%84%9A%E6%89%8B%E6%9E%B6%E4%BD%BF%E7%94%A8%E3%80%81%20%E5%88%9B%E5%BB%BA%E3%80%81%E8%BF%90%E8%A1%8C%E9%A1%B9%E7%9B%AE.pdf";
import PdfGraffiti from "./lib/PdfGraffiti.vue";
export default {
  name: "App",
  components: {
    PdfGraffiti,
  },
  data() {
    return {
      pdfurl: url,
      isEdit: false,
      pdfData: "123test",
    };
  },
  watch: {
    pdfData: {
      handler: function (val) {
        console.log(val);
      },
      deep: true,
    },
  },
  methods: {
    save() {
      this.$refs.pdfVue.save();
    },
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
