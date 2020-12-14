import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
  {
    path: "/dashboard/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "dashboard", path: "", component: () => import("pages/Dashboard.vue"), meta: { title: "Dashboard" },
      },
    ],
  },
  {
    path: "/cells/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "cellDatabase", path: "", component: () => import("pages/CellDatabase.vue"), meta: { title: "Cell Database" },
      },

      {
        name: "cellDatabaseDefault", path: "*", component: () => import("pages/CellDatabase.vue"), meta: { title: "Cell Database" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
