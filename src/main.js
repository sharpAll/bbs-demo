import Vue from "vue";
import ElementUI from "element-ui"; // 组件库
import "element-ui/lib/theme-chalk/index.css"; // 样式
import App from "./App.vue";
import router from "./router";
import store from "./store";
//权限拦截
import "./utils/permission.js";
//富文本样式
import "tinymce/skins/content/default/content.min.css";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/themes/silver";
//公共样式
import "@/assets/style/common.css";
Vue.use(ElementUI);
Vue.config.productionTip = process.env.NODE_ENV === "production";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
