<template>
  <div class="uploader">
    <input
      type="file"
      class="uploader-input"
      ref="uploader"
      @change="changeFile"
    />
  </div>
</template>

<script>
export default {
  name: "uploader",
  methods: {
    selectFile() {
      this.$refs.uploader.click();
    },
    changeFile(e) {
      this.$emit("selectChange", e.target.files);
    },
  },
};
</script>

<style lang="scss" scoped>
.uploader {
  .uploader-input {
    display: none;
  }
}
</style>
