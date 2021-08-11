import Vue from "vue";
import VueRouter from "vue-router";
//登录
import Login from "@/views/login";
//布局组件
import Layout from "@/components/Layout.vue";
//主页
import Home from "@/views/home/index.vue";
/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/",
    name: "layout",
    component: Layout,
    redirect: "/home", //重定向到子路由
    children: [
      {
        path: "/home",
        component: Home,
        name: "/home", //处理刷新后默认路由选中问题
        meta: { title: "首页" }, //路由元信息
      },
      // ,{
      //   path:'/member/',
      //   component:Member,
      //   meta: {title: '会员管理'}
      // }
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
