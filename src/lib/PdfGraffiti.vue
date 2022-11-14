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
        v-if="isReady"
      ></Signature>
    </div>
    <Uploader @selectChange="changeFile" ref="uploader" />
    <div class="handle-list">
      <div @click="isEdit = !isEdit" class="show-btn">签字</div>
      <div @click="back" class="show-btn">撤销</div>
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
const pdfUrl =
  "https://coke-1304800772.cos.ap-chongqing.myqcloud.com/test/01%E3%80%81beego%20%E7%AE%80%E4%BB%8B%20%E4%BB%A5%E5%8F%8Abeego%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E3%80%81bee%E8%84%9A%E6%89%8B%E6%9E%B6%E4%BD%BF%E7%94%A8%E3%80%81%20%E5%88%9B%E5%BB%BA%E3%80%81%E8%BF%90%E8%A1%8C%E9%A1%B9%E7%9B%AE.pdf";
export default {
  name: "PdfGraffiti",
  components: {
    VuePdf,
    Signature,
    Uploader,
  },
  data() {
    return {
      src: "",
      numPages: null,
      show: true,
      isEdit: false,
      isEraser: false,
      height: 60,
      isReady: false,
      pdfInfo: {
        pdf: "xxx.pdf",
      },
    };
  },
  mounted() {
    this.render(pdfUrl);
  },
  watch: {
    isReady: {
      handler: function (val) {
        console.log(val, "-----------");
      },
      deep: true,
    },
  },
  methods: {
    render(url) {
      this.src = VuePdf.createLoadingTask(url);
      this.src.promise.then((pdf) => {
        this.numPages = pdf.numPages;
      });
    },
    back() {
      this.$refs.signature.undo();
    },
    clear() {
      this.$refs.signature.clear();
    },
    eraser() {
      this.isEraser = !this.isEraser;
      const color = this.isEraser ? "red" : "#000";
      this.$refs.signature.eraser(color);
    },
    loaded(page) {
      if (page !== this.numPages) return;
      const dom = document.querySelector(".pdf-content");
      this.height = dom.offsetHeight;
      this.isReady = true;
      console.log("ready", "---------------", this.isReady);
    },
    save() {
      console.log("save");
      this.$refs.signature.save();
    },
    importPdf() {
      this.$refs.uploader.selectFile();
    },
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
    async exportNote() {
      const noteCanvas = await this.getContainerToImg("note-container");
      this.download(noteCanvas);
    },
    toPageLocation(page) {
      document.querySelector("#pdf" + page).scrollIntoView(true);
    },
    initNote(img) {
      this.$refs.signature.fromDataURL(img);
    },
    importNote() {
      this.initNote();
    },
    async htmlToPdf() {
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
      PDF.save("测试" + ".pdf");
    },
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
      console.log(top);
    },
  },
  created() {
    console.log(html2canvas, "html2canvas---");
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
  border: 1px solid #e5e5e5;
  z-index: 998;
}
</style>
