import axios from "axios";
import { Loading, Message } from "element-ui";
import { getToken } from "@/utils/auth";
import router from "../router";
import store from "../store";
// 统一配置加载中
const loading = {
  loadingInstance: null,
  open() {
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        target: ".main",
      });
    }
  },
  close() {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close();
    }
    this.loadingInstance = null;
  },
};

const request = axios.create({
  baseURL: process.env.VUE_APP_SERVICE_URL,
  timeout: 5000,
  // headers: {}
});
// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    config.headers.token = getToken();
    loading.open();
    // Do something before request is sent
    return config;
  },
  function (error) {
    loading.close();
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
request.interceptors.response.use(
  (response) => {
    loading.close();
    const resp = response.data;
    if (resp.code !== 200) {
      if (resp.code == 401) {
        store.dispatch("Logout").then((state) => {
          if (state) {
            router.push("/login");
          } else {
            this.$message({
              message: "退出失败",
              type: "warning",
              duration: 500, // 弹出停留时间
            });
          }
        });
      } else {
        Message({
          message: resp.msg || "系统异常",
          type: "warning",
          duration: 5 * 1000, // 停留时长
        });
      }
    }
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  (error) => {
    loading.close();
    // 当请求接口出错时, 进行弹出错误提示, 如 404, 500, 请求超时
    console.log("response error", error.response.status);
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default request;
