<template>
  <div id="application">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 使用路由
const router = useRouter()

// 判断是否已经登录，如果没有则跳转到登录界面
onMounted(() => {
  const localToken = localStorage.getItem(import.meta.env.VITE_LOCAL_TOKEN_KEY)
  if (localToken) {
    router.push("/main")
  } else {
    router.push("/login")
  }
})

</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
  #application {
    color: $DefaultColorScheme;
    fill: $DefaultColorScheme;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgb(245, 245, 245);
  }
</style>
