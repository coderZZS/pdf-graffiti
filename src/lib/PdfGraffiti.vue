<template>
  <div class="content pdf-content" @scroll="onPageScroll">
    <div class="pdf-container">
      <VuePdf
        :src="src"
        v-for="i in numPages"
        :key="i"
        :page="i"
        :id="'pdf' + i"
        style="width: 100%"
        @page-loaded="loaded"
      ></VuePdf>
    </div>
    <div class="note-container">
      <Signature
        :isEdit="isEdit"
        ref="signature"
        :canvasHeight="height + 'px'"
        @save="onSave"
        v-if="isReady"
      ></Signature>
    </div>
    <Uploader @selectChange="changeFile" ref="uploader" />
    <div class="handle-list" v-if="showTools">
      <div @click="toggleEdit" class="show-btn">
        {{ isEdit ? "禁用" : "启用" }}
      </div>
      <div @click="undo" class="show-btn">撤销</div>
      <div @click="clear" class="show-btn">清除</div>
      <div @click="eraser" class="show-btn">颜色</div>
      <div @click="save" class="show-btn">保存</div>
      <div @click="importPdf" class="show-btn">切换</div>
      <div @click="exportAll" class="show-btn">导出</div>
      <div @click="exportNote" class="show-btn">笔记</div>
      <div @click="toPageLocation(3)" class="show-btn">跳转</div>
      <div @click="importNote" class="show-btn">笔迹</div>
      <div @click="htmlToPdf" class="show-btn">PDF</div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import VuePdf from "vue-pdf";
import { jsPDF } from "jspdf";
import Signature from "./Signature.vue";
import Uploader from "./Uploader.vue";
export default {
  name: "PdfGraffiti",
  components: {
    VuePdf,
    Signature,
    Uploader,
  },
  props: {
    value: {
      type: [Object, String],
      default: () => {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    pdfUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      src: "",
      numPages: null,
      show: true,
      height: 60,
      isReady: false,
      showTools: false,
    };
  },
  watch: {
    pdfUrl: {
      handler: function (url) {
        if (!url) return;
        this.$nextTick(() => {
          this.render(url);
        });
      },
      immediate: true,
    },
  },
  methods: {
    toggleEdit() {
      this.$emit("update:isEdit", !this.isEdit);
    },
    /**
     * 保存当前数据
     * @return {object}
     */
    onSave({ isEmpty, data }) {
      this.$emit("onSave", { isEmpty, data });
      this.$emit("input", { isEmpty, data });
    },
    /**
     * 渲染pdf
     * @param {string} url 绝对地址/DataURL
     */
    render(url) {
      this.src = VuePdf.createLoadingTask(url);
      this.src.promise.then((pdf) => {
        this.numPages = pdf.numPages;
      });
    },
    /**
     * 撤销
     */
    undo() {
      this.$refs.signature.undo();
    },
    /**
     * 清除当前画布
     */
    clear() {
      this.$refs.signature.clear();
    },
    /**
     * 切换颜色
     * @param {string} color 十六进制颜色码
     */
    eraser(color = "#000") {
      this.$refs.signature.eraser(color);
    },
    /**
     * pdf加载完成
     */
    loaded(page) {
      if (page !== this.numPages) return;
      const dom = document.querySelector(".pdf-content");
      this.height = dom.offsetHeight;
      this.isReady = true;
      this.$emit("onLoaded", this.numPages);
    },
    /**
     * 保存
     */
    save() {
      this.$refs.signature.save();
    },
    /**
     * 导入pdf
     */
    importPdf() {
      this.$refs.uploader.selectFile();
    },
    /**
     * 下载pdf
     */
    download(canvas) {
      const imageBase64 = canvas.toDataURL("image/png");
      const imageFile = this.dataUrlToFile(imageBase64);
      const imageUrl = URL.createObjectURL(imageFile);
      const download = document.createElement("a", {
        download: true,
      });
      download.setAttribute("href", imageUrl);
      download.setAttribute("download", imageFile.name);
      download.click();
    },
    /**
     * 导出pdf+笔迹为图片
     */
    async exportAll() {
      const pdfCanvas = await this.getContainerToImg("pdf-content");
      this.download(pdfCanvas);
    },
    async getContainerToImg(className) {
      const container = document.querySelector(`.${className}`);
      try {
        const canvas = await html2canvas(container);
        return canvas;
      } catch (error) {
        console.log(error);
      }
    },
    dataUrlToFile(dataurl, filename = "文件") {
      // 获取到base64编码
      const arr = dataurl.split(",");
      // 将base64编码转为字符串
      const bstr = window.atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: "image/png",
      });
    },
    /**
     * 导出笔迹为png
     */
    async exportNote() {
      const noteCanvas = await this.getContainerToImg("note-container");
      this.download(noteCanvas);
    },
    /**
     * 前往页码
     * @param {number} page 页码
     */
    toPageLocation(page) {
      document.querySelector("#pdf" + page).scrollIntoView(true);
    },
    /**
     * 初始化笔迹
     * @param {string} DataURL 存储的数据DataURL
     */
    initNote(DataURL) {
      if (!DataURL) return;
      this.$refs.signature.fromDataURL(DataURL);
    },
    importNote() {
      this.initNote();
    },
    async htmlToPdf(fileName = "文件") {
      const pdfCanvas = await this.getContainerToImg("pdf-content");
      //   const options = {
      //     scale: 12,
      //     useCORS: true,
      //     allowTaint: false,
      //     tainttest: true,
      //     logging: true,
      //   };
      const contentWidth = pdfCanvas.width;
      const contentHeight = pdfCanvas.height;
      // 一页pdf显示html页面生成的canvas高度;
      const pageHeight = (contentWidth / 592.28) * 841.89;
      // 未生成pdf的html页面高度
      let leftHeight = contentHeight;
      // 页面偏移
      let position = 0;
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      const imgWidth = 595.28;
      const imgHeight = (592.28 / contentWidth) * contentHeight;
      const pageData = pdfCanvas.toDataURL("image/jpeg", 1.0);
      // a4纸纵向，一般默认使用；new JsPDF('landscape'); 横向页面
      const PDF = new jsPDF("", "pt", "a4");

      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        // addImage(pageData, 'JPEG', 左，上，宽度，高度)设置
        PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        // 超过一页时，分页打印（每页高度841.89）
        while (leftHeight > 0) {
          PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
      PDF.save(fileName + ".pdf");
    },
    /**
     * 加载本地pdf
     */
    selectFile() {
      this.$refs.uploader.selectFile();
    },
    changeFile(files) {
      if (files.length) {
        this.isReady = false;
        const file = files[0];
        const url = URL.createObjectURL(file);
        this.render(url);
      }
    },
    onPageScroll(e) {
      const top = e.scrollTop / this.height;
      this.$emit("onPageScroll", top);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.show-btn {
  background: skyblue;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.handle-list {
  width: 40px;
  height: 420px;
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 999;
}
.note-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 998;
}
</style>
