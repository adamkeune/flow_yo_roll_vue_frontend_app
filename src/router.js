import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Signup from "./views/Signup.vue";
import Login from "./views/Login.vue";
import Logout from "./views/Logout.vue";
import Frontpage from "./views/Frontpage.vue";
import TechniquesIndex from "./views/TechniquesIndex.vue";
import TechniquesShow from "./views/TechniquesShow.vue";
import TechniquesNew from "./views/TechniquesNew.vue";
import VideosIndex from "./views/VideosIndex.vue";
import VideosCreate from "./views/VideosCreate.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
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
      path: "/frontpage",
      name: "frontpage",
      component: Frontpage
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
      path: "/techniques-new",
      name: "techniques-new",
      component: TechniquesNew
    },
    {
      path: "/videos",
      name: "videos",
      component: VideosIndex
    },
    {
      path: "/videos-new",
      name: "videos-new",
      component: VideosCreate
    }
  ]
});
