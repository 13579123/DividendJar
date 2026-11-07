<template>
  <div id="target-page">
    <div class="return">
      <svg t="1793674063154" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        @click="router.back()" p-id="6433" width="40" height="40">
        <path d="M137.195012 473.012753l343.015525-236.983218-0.308863 468.654345z" p-id="6434" fill="#8a8a8a"></path>
        <path
          d="M480.667511 706.240841l-1.146949-0.774868L135.66695 473.021784 480.978181 234.452705v1.578636l-0.31067 470.2095zM138.723073 473.003722L479.135837 703.125112l0.308863-465.518748L138.723073 473.003722z"
          p-id="6435" fill="#8a8a8a"></path>
        <path
          d="M807.983377 647.341831s-7.347701-39.173288-31.538398-63.073184c-18.555293-18.331321-30.10426-28.670122-57.340243-34.404868-70.879664-14.921179-394.378989 0.050574-394.378989 0.050574V413.73263s214.893154-3.375824 285.431443 11.417113c20.932277 4.389113 57.967001 10.044386 83.143895 22.935375 27.143866 13.900665 53.628462 34.040012 67.375598 50.173164 46.838883 54.974096 47.306694 149.083548 47.306694 149.083549z"
          p-id="6436" fill="#8a8a8a"></path>
      </svg>
    </div>
    <div class="list">
      <div class="item" v-for="(target, index) in userTarget">
        <div class="icon">
          <div class="back"></div>
          <TargetIcon :icon-index="target.icon"></TargetIcon>
        </div>
        <div class="data">
          <div class="name">
            <div style="width: 35%;" v-if="showNameChangeIndex === index">
              <el-input v-model="target.name" @blur="changeTarget(target)"></el-input>
            </div>
            <div v-else>
              <span>{{ target.name }}</span>
              <span class="change-btn" @click="showMoneyChangeIndex = -1; showNameChangeIndex = index">修改</span>
            </div>
          </div>
          <div class="money">
            <div style="width: 45%;" v-if="showMoneyChangeIndex === index">
              <el-input v-model="target.money" type="number" @blur="changeTarget(target)"></el-input>
            </div>
            <div v-else>
              <span>{{ "每月开支: ￥" + target.money }}</span>
              <span class="change-btn" @click="showMoneyChangeIndex = index; showNameChangeIndex = -1">修改</span>
            </div>
          </div>
        </div>
        <div class="operation">
          <el-button type="danger" round @click="deleteUserTarget(target.id)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="add-container" v-if="openAddContainer">
      <div class="box">
        <h3> 添加开支目标 </h3>
        <div class="icons">
          <div class="icon" v-for="(value, index) in 13" @click="newTargetData.icon = index">
            <div class="back" :style="{ top: index === newTargetData.icon ? '0' : '' }"></div>
            <TargetIcon :icon-index="index"></TargetIcon>
          </div>
        </div>
        <div class="line">
          <span>名称: </span>
          <el-input v-model="newTargetData.name"></el-input>
        </div>
        <div class="line">
          <span>开支: </span>
          <el-input type="number" v-model="newTargetData.money"></el-input>
          <span>￥</span>
        </div>
        <div class="line">
          <el-button type="success" @click="addUserTarget()">添加</el-button>
          <el-button type="info" @click="openAddContainer = false">取消</el-button>
        </div>
      </div>
    </div>
    <div class="add" @click="openAddContainer = true"> 添加目标 </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import TargetIcon from "@/components/share/TargetIcon.vue"
import type { Target } from '@/util/type/Target';
import { onMounted, reactive, ref } from 'vue';
import { api } from '@/util/api';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter()

const openAddContainer = ref(false)

const showNameChangeIndex = ref(-1)

const showMoneyChangeIndex = ref(-1)

const newTargetData = reactive({
  name: "",
  money: 0,
  icon: 0
})

// 分红目标
const userTarget = ref<Target[]>([])

onMounted(() => getTargetData())

// 获取目标
function getTargetData() {
  // 加载动画
  const loadingInstance = ElLoading.service()
  return api.account.userTarget()
    .then((result) => {
      if (!result.data.success) return ElMessage.warning(result.data.message)
      userTarget.value = result.data.response
    })
    .finally(() => loadingInstance.close())
}

// 添加目标
function addUserTarget() {
  const icon: number = newTargetData.icon
  const name: string = newTargetData.name
  const money: number = newTargetData.money
  // 加载动画
  const loadingInstance = ElLoading.service()
  return api.account.addUserTarget(name, money, parseInt(icon + ""))
    .then((result) => {
      if (!result.data.success) return ElMessage.warning(result.data.message)
      ElMessage.success(result.data.message)
      openAddContainer.value = false
      return getTargetData()
    })
    .finally(() => loadingInstance.close())
}

// 删除
function deleteUserTarget(id: number) {
  // 加载动画
  ElMessageBox.confirm("确定要删除吗?")
    .then(() => {
      const loadingInstance = ElLoading.service()
      api.account.deleteUserTarget(id + "")
        .then((result) => {
          if (!result.data.success) return ElMessage.warning(result.data.message)
          ElMessage.success(result.data.message)
          return getTargetData()
        })
        .finally(() => loadingInstance.close())
    })
    .catch(e => e)
}

// 发送修改请求
function changeTarget(target: Target) {
  // 加载动画
  const loadingInstance = ElLoading.service()
  api.account.changeuserTarget(target)
    .then((result) => {
      if (!result.data.success) return ElMessage.warning(result.data.message)
      ElMessage.success(result.data.message)
      return getTargetData()
    })
    .finally(() => loadingInstance.close())
  showNameChangeIndex.value = -1
  showMoneyChangeIndex.value = -1
}

</script>

<style lang="scss" scoped>
#target-page {
  .return {
    height: 60px;
    display: flex;
    padding: 0 10px;
    box-sizing: border-box;
    box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: 0.2);
    align-items: center;
    background-color: white;
  }

  .list {
    .item {
      .icon {
        .back {
          width: 100%;
          height: 100%;
          position: absolute;
          background-color: rgba($color: $MainColorScheme, $alpha: 0.3);
        }

        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        overflow: hidden;
        position: relative;
        border: 1px solid rgba($color: $MainColorScheme, $alpha: 1.0);
      }

      .data {
        padding-left: 15px;
        width: 60%;
      }

      .operation {
        display: flex;
        align-items: center;
      }

      .change-btn {
        color: rgb(48, 81, 230);
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }

      display: flex;
      width: 100%;
      padding: 10px 10px;
      box-sizing: border-box;
      background-color: white;
      border-radius: 10px;
      margin-bottom: 15px;
      box-shadow: 0 0 3px 1px rgba($color: #000000, $alpha: 0.2);
    }

    width: 95%;
    height: 70vh;
    margin: 20px auto 0 auto;
  }

  .add-container {
    .box {
      .icons {
        .icon {
          .back {
            width: 100%;
            height: 100%;
            transition: all 0.3s;
            position: absolute;
            top: 100%;
            background-color: rgba($color: $MainColorScheme, $alpha: 0.3);
          }

          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 100%;
          overflow: hidden;
          position: relative;
          margin-right: 10px;
          border: 1px solid rgba($color: $MainColorScheme, $alpha: 1.0);
          margin-bottom: 5px;
        }

        width: 100%;
        height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
      }

      .line {
        .el-input {
          width: 70%;
          padding: 5%;
        }

        display: flex;
        align-items: center;
      }

      width: 90%;
      min-width: 300px;
      max-width: 600px;
      padding: 20px 15px;
      background-color: white;
      box-sizing: border-box;
      border-radius: 10px;
    }

    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba($color: #000000, $alpha: 0.2);
  }

  .add {
    width: 95%;
    outline: none;
    color: white;
    display: flex;
    justify-content: center;
    border: 2px solid $MainColorScheme;
    background-color: rgba($color: $MainColorScheme, $alpha: 0.6);
    box-sizing: border-box;
    margin: 10px auto 0 auto;
    font-size: 18px;
    border-radius: 10px;
    padding: 5px 0;
    cursor: pointer;
  }
}
</style>