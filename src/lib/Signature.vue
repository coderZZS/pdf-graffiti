<template>
  <div class="container" :class="{ 'edit-mode': isEdit }">
    <VueSignaturePad
      width="100%"
      :height="canvasHeight"
      ref="signaturePad"
      :options="options"
    ></VueSignaturePad>
  </div>
</template>

<script>
import Vue from "vue";
import VueSignaturePad from "vue-signature-pad";
Vue.use(VueSignaturePad);
export default {
  name: "Signature",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    canvasHeight: {
      type: String,
      default: "600px",
    },
  },
  data() {
    return {
      options: {
        penColor: "#000",
      },
      pdfInfo: {
        pdf: "xxxx.pdf",
        readLocation: "50%",
      },
      catchData: "",
    };
  },
  methods: {
    save() {
      console.log(this.$refs.signaturePad, "this.$refs.signaturePad.");
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.catchData = data;
      this.$emit("save", { isEmpty, data });
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    clear() {
      this.$refs.signaturePad.clearSignature();
    },
    eraser(color = "#fff") {
      this.options = {
        penColor: color,
      };
      console.log(this.canvasHeight);
    },
    fromDataURL(dataURL) {
      this.$refs.signaturePad.fromDataURL(dataURL);
    },
  },
};
</script>

<style lang="scss">
.container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  border: 1px solid #e5e5e5;
  z-index: 998;
}
.edit-mode {
  pointer-events: none;
}
</style>
