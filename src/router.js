import Vue from "vue";
import Router from "vue-router";
import Signup from "./views/Signup.vue";
import Login from "./views/Login.vue";
import Logout from "./views/Logout.vue";
import Frontpage from "./views/Frontpage.vue";
import TechniquesIndex from "./views/TechniquesIndex.vue";
import TechniquesShow from "./views/TechniquesShow.vue";
import VideosIndex from "./views/VideosIndex.vue";
import FlowsIndex from "./views/FlowsIndex.vue";
import FlowsShow from "./views/FlowsShow.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "frontpage",
      component: Frontpage
    },
    {
      path: "/frontpage",
      name: "frontpage",
      component: Frontpage
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout
    },
    {
      path: "/techniques",
      name: "techniques",
      component: TechniquesIndex
    },
    {
      path: "/techniques/:id",
      name: "techniques-show",
      component: TechniquesShow
    },
    {
      path: "/videos",
      name: "videos",
      component: VideosIndex
    },
    {
      path: "/flows",
      name: "flows",
      component: FlowsIndex
    },
    {
      path: "/flows/:id",
      name: "flows-show",
      component: FlowsShow
    }
  ]
});
