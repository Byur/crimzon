import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../pages/Home";
import Playground from "../pages/playground/Playground";
import AboutForms from "../pages/playground/AboutForms";
import richEditor from "../pages/playground/richEditor";
import blank from "../pages/playground/blank";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/playground",
    name: "playground",
    component: Playground,
    children: [
      {
        path: "aboutForms",
        name: "aboutForms",
        component: AboutForms
      }
    ]
  },
  {
    path: "/richEditor",
    name: "richEditor",
    component: richEditor
  },
  {
    path: "/blank",
    name: "blank",
    component: blank
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
