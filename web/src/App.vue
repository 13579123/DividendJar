<template>
  <div id="application">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { request } from './util/request';
import { ElLoading, ElMessage } from 'element-plus';

// 使用路由
const router = useRouter()

// 判断是否已经登录，如果没有则跳转到登录界面
onMounted(() => {
  // 是否有登录信息
  const localToken = localStorage.getItem(import.meta.env.VITE_LOCAL_TOKEN_KEY)
  if (localToken) {
    // 加载动画
    const loadingInstance = ElLoading.service({
      lock: true, // 锁定屏幕
      text: '加载中...', // 自定义文字
      background: 'rgba(0, 0, 0, 0.7)', // 背景颜色
      fullscreen: true // 全屏模式
    })
    // 登录信息是否合法
    request.get("/account/accountData")
    .then((response) => {
      if (!response.data.success) {
        ElMessage.warning(response.data.message)
        router.push("/login")
      } else {
        router.push("/main")
      }
    }).finally(() => loadingInstance.close())
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
