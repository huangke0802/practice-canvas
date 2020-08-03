import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "./pages/HelloWorld";
import CityPic from "./pages/CityPic";
import Gobang from "./pages/Gobang";
import SvgPage from "./pages/SvgPage";
import SvgCityPic from "./pages/SvgCityPic";
import WebGL from "./pages/WebGL";
import RegularPolygonWebGL from './pages/RegularPolygonWebGL'
import LotteryDraw from './pages/LotteryDraw'
import RegularShap_01 from './pages/RegularShap_01'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Gobang
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
    },
    {
      path: "/svgpage",
      component: SvgPage
    },
    {
      path: "/svgcitypic",
      component: SvgCityPic
    },
    {
      path: "/webgl",
      component: WebGL
    },
    {
      path:'/regularpolygonwebgl',
      component:RegularPolygonWebGL,
    },
    {
      path:'/lotterydraw',
      component:LotteryDraw
    },
    {
      path:'/regularshap_01',
      component:RegularShap_01
    },
  ]
});

export default router;
