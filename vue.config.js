const { defineConfig } = require("@vue/cli-service");
const isProd = process.env.NODE_ENV === "production";
const externalsOption = {
  html2canvas: "html2canvas",
  jspdf: "jspdf",
  "vue-signature-pad": "vue-signature-pad",
  "vue-pdf": "vue-pdf",
};
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    externals: isProd
      ? {
          ...externalsOption,
        }
      : {},
  },
});
