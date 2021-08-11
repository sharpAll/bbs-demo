import { login, getUserInfo } from "@/api/login";
import {
  getToken,
  setToken,
  setUser,
  getUser,
  removeToken,
} from "@/utils/auth";
const user = {
  state: {
    //由于vuex在刷新页面后数据池会重置，所以使用localstorage保存数据池的初始值
    token: getToken(),
    user: getUser(),
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      setToken(token);
    },
    SET_USER(state, user) {
      state.user = user;
      setUser(user);
    },
  },
  actions: {
    // 登录获取token
    Login({ commit }, form) {
      return new Promise((resolve, reject) => {
        login(form)
          .then((response) => {
            const resp = response;
            commit("SET_TOKEN", resp.token);
            resolve(resp);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 通过token获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((response) => {
            const respUser = response;
            commit("SET_USER", respUser.info);
            resolve(respUser);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    //退出
    Logout({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        commit("SET_USER", null);
        removeToken();
        resolve(true);
      });
    },
  },
};
export default user;
