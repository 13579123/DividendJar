<template>
  <div id="main-account-page">
    <div class="card base-data">
      <div class="avatar-nickname">
        <img src="" class="avatar">
        <div class="nickname">
          <el-input v-if="isChangeNickname" v-model="accountData.nickname" @blur="changeNicknameFocus"></el-input>
          <div class="name" v-else>{{ accountData.nickname || "用户9527" }}</div>
          <div class="create-time">
            出生时间: {{ new Date(accountData.createTime).getFullYear() }}-{{ new Date(accountData.createTime).getMonth() +
              1 }}-{{
              new Date(accountData.createTime).getDate() }}
          </div>
          <div class="operate">
            <span class="change-nickname-btn" @click="changeNickname"> 修改昵称 </span>
          </div>
        </div>
      </div>
    </div>
    <div class="card operate-card">
      <div class="operate-item" @click="outlogin">
        <div>退出登录</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api, request } from '@/util/api';
import { Account } from '@/util/type/Account';
import { ElLoading, ElLoadingService, ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const accountData = ref<Account>(new Account)

const isChangeNickname = ref(false)

const router = useRouter()

onMounted(() => getAccountData())

async function getAccountData() {
  // 加载动画
  const loadingInstance = ElLoading.service({
    lock: true, // 锁定屏幕
    text: '加载中...', // 自定义文字
    background: 'rgba(0, 0, 0, 0.7)', // 背景颜色
    fullscreen: true // 全屏模式
  })
  api.account.accountData().then((result) => {
    if (!result.data.success) return ElMessage.warning(result.data.message)
    result.data.response.createTime = new Date(result.data.response.createTime)
    result.data.response.updateTime = new Date(result.data.response.updateTime)
    accountData.value = result.data.response
  }).finally(() => {
    loadingInstance.close()
  })
}

async function changeNickname() {
  isChangeNickname.value = true
}

async function changeNicknameFocus() {
  // 加载动画
  const loadingInstance = ElLoading.service({
    lock: true, // 锁定屏幕
    text: '加载中...', // 自定义文字
    background: 'rgba(0, 0, 0, 0.7)', // 背景颜色
    fullscreen: true // 全屏模式
  })
  api.account.changeNickname(accountData.value.nickname).then(async (result) => {
    isChangeNickname.value = false
    if (!result.data.success) return ElMessage.warning(result.data.message)
    await getAccountData()
  }).finally(() => {
    loadingInstance.close()
  })
}

function outlogin() {
  ElMessageBox.confirm("确定要推出登录吗", "确认", { cancelButtonText: "取消", confirmButtonText: "确定" })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '退出登录成功',
      })
      localStorage.removeItem(import.meta.env.VITE_LOCAL_TOKEN_KEY)
      router.push("/login")
    })
    .catch(() => null)
}

</script>

<style scoped lang="scss">
#main-account-page {
  .card {
    background-color: white;
    width: 95%;
    padding: 20px 15px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 0 auto;
    margin-bottom: 20px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
  }

  .base-data {
    .avatar-nickname {
      .avatar {
        width: 80px;
        height: 80px;
      }

      .nickname {
        .name {
          font-size: 18px;
        }

        .create-time {
          font-size: 14px;
          padding-top: 5px;
        }

        .operate {
          .change-nickname-btn {
            cursor: pointer;
          }

          padding-top: 5px;
          font-size: 14px;
          color: rgb(60, 95, 255);
        }

        flex-grow: 1;
        padding-left: 20px;
        box-sizing: border-box;
      }

      width: 100%;
      height: 80px;
      display: flex;
    }
  }

  .operate-card {
    .operate-item {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      height: 50px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 18px;
    }
  }

  padding-top: 20px;
  padding-bottom: 100px;
}
</style>