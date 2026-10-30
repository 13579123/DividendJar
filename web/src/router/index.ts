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
      component: () => Main
    },
  ],
})

export default router
