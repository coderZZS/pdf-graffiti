const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    externals: {
      html2canvas: "html2canvas",
      jspdf: "jspdf",
      "vue-signature-pad": "vue-signature-pad",
      "vue-pdf": "vue-pdf",
    },
  },
});
