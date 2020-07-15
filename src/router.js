import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "./pages/HelloWorld";
import CityPic from "./pages/CityPic";
import Gobang from "./pages/Gobang";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: HelloWorld
    },
    {
      path: "/index",
      component: HelloWorld
    },
    {
      path: "/citypic",
      component: CityPic
    },
    {
      path: "/gobang",
      component: Gobang
    }
  ]
});

export default router;
