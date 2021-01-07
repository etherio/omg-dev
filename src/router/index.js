import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/views/Dashboard.vue"),
  },
  {
    path: "/login",
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/logout",
    component: () => import("@/views/logout.vue"),
  },
  {
    path: "/users",
    component: () => import("@/views/Users.vue"),
  },
  {
    path: "/profile",
    component: () => import("@/views/Profile.vue"),
  },
  {
    path: "/products",
    component: () => import("@/views/products/index.vue"),
  },
  {
    path: "/products/new",
    component: () => import("@/views/products/create.vue"),
  },
  {
    path: "/facebook",
    component: () => import("@/views/products/facebook.vue"),
  },
  {
    path: "/reviews",
    component: () => import("@/views/reviews.vue"),
  },
  {
    path: "/products/:id/clone",
    component: () => import("@/components/ProductDuplicate.vue"),
  },
  {
    path: "/products/:id",
    component: () => import("@/views/products/product.vue"),
  },
  {
    path: "/categories",
    component: () => import("@/views/Categories.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
