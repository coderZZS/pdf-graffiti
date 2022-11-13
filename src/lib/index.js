import PdfGraffiti from "./PdfGraffiti.vue";
import Signature from "./Signature.vue";
import Uploader from "./Uploader.vue";

const components = [Uploader, PdfGraffiti, Signature];
// const components = [PdfGraffiti, UploadFile];

const install = (vue) => {
  components.forEach((component) => {
    vue.component(component.name, component);
  });
};

export { Uploader, PdfGraffiti, Signature };

export default {
  install,
  components,
};
