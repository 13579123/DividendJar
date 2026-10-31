import Main from '@/page/Main.vue'
import Login from '@/page/Login.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => Login
    },
    {
      path: "/main",
      name: "main",
      component: () => Main,
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
