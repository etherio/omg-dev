import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/views/Dashboard.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("@/views/Users.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("@/views/products/index.vue"),
  },
  {
    path: "/products/new",
    name: "Create new product",
    component: () => import("@/views/products/create.vue"),
  },
  {
    path: "/products/:id/clone",
    name: "Clone Product",
    component: () => import("@/components/ProductDuplicate.vue"),
  },
  {
    path: "/products/:id",
    name: "Product",
    component: () => import("@/views/products/product.vue"),
  },
  {
    path: "/categories",
    name: "Categories",
    component: () => import("@/views/Categories.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
