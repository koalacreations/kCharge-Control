import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "dashboard",
        path: "",
        component: () => import("pages/Dashboard.vue"),
        meta: { title: "Dashboard" }
      },
      {
        path: "/settings/",
        name: "settings",
        component: () => import("pages/Settings.vue"),
        meta: { title: "Settings" }
      },
    ]
  },
  {
    path: "/cells/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "cellDatabase",
        path: "",
        component: () => import("pages/CellDatabase.vue"),
        meta: { title: "Cells" }
      },
      {
        name: "cellDatabaseDefault",
        path: "*",
        component: () => import("pages/CellDatabase.vue"),
        meta: { title: "Cells" }
      }
    ]
  },
  {
    path: "/cell/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "editCell",
        path: ":cellId",
        component: () => import("pages/EditCellPage.vue"),
        meta: { title: "Edit Cell", backButton: true, backRoute: "cellDatabase" }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
