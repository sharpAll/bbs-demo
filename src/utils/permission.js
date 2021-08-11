import router from "../router";
import store from "../store";
import { setToken } from "@/utils/auth";
router.beforeEach((to, from, next) => {
  let token = "";
  if (to.query.token) {
    token = to.query.token;
    setToken(token);
    store.state.user.user = "";
  } else {
    token = store.state.user.token;
  }
  console.log(token);
  if (!token) {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      const userInfo = store.state.user.user;
      if (userInfo) {
        next();
      } else {
        store
          .dispatch("GetUserInfo")
          .then((response) => {
            if (response.flag) {
              next();
            } else {
              next({ path: "/login" });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
});
