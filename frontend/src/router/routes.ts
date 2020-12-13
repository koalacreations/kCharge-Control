import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/dashboard/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue'), meta: { title: "Dashboard" } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
