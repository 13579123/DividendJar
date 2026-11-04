import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import('@/page/Login.vue')
    },
    {
      path: "/deal",
      name: "daeal",
      component: () => import('@/page/Deal.vue')
    },
    {
      path: "/main",
      name: "main",
      component: () => import('@/page/Main.vue'),
      children: [
        {
          path: "",
          name: "main-index",
          component: () => import('@/page/Main/Index.vue')
        },
        {
          path: "attention",
          name: "main-attention",
          component: () => import('@/page/Main/Attention.vue')
        },
        {
          path: "account",
          name: "main-account",
          component: () => import('@/page/Main/Account.vue')
        },
        {
          path: "holdings",
          name: "main-holdings",
          component: () => import('@/page/Main/Holdings.vue')
        },
        {
          path: "message",
          name: "main-message",
          component: () => import('@/page/Main/Message.vue')
        },
      ]
    },
  ],
})

export default router
