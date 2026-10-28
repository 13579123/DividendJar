<template>
  <div id="login-page">
    <div class="background"></div>
    <div class="login-form">
      <h2 class="title"> 登录/注册 </h2>
      <div class="account">
        <span> 邮箱 </span>
        <input type="text" placeholder="请输入邮箱" v-model="userEmail">
      </div>
      <div class="code">
        <span> 验证码 </span>
        <div class="code-line">
          <div class="code-input">
            <input type="text" placeholder="请输入验证码" v-model="userCode">
          </div>
          <button @click="getCode"> {{ getCodeTime === 0 ? "获取验证码" : getCodeTime }} </button>
        </div>
      </div>
      <button @click="login"> 登录/注册 </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const userEmail = ref("")

const userCode = ref("")

const getCodeTime = ref(0)

// 发送请求获取验证码
async function getCode() {
  if (!userEmail.value) {
    return ElMessage.warning("请输入有效的邮箱")
  }
  if (getCodeTime.value > 0) {
    return
  }
  getCodeTime.value = 60
  const inter = setInterval(() => {
    getCodeTime.value -= 1
    if (getCodeTime.value === 0) clearInterval(inter)
  }, 1000);
  // 发送请求获取验证码

}

// 登录或者注册
async function login() {

}

</script>

<style scoped lang="scss">
#login-page {
  
  .background {
    width: 150px;
    height: 150px;
    position: fixed;
    border-radius: 100%;
    background-color: $MainColorScheme;
  }

  .login-form {

    .title {
      text-align: center;
    }

    .account,
    .code {
      &>span {
        margin-bottom: 5px;
      }
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      margin-top: 30px;
      width: 100%;
    }

    .code {
      .code-line {
        .code-input {
          width: 60%;
        }

        button {
          width: 35%;
          border: none;
          border-radius: 5px;
          height: 40px;
          color: white;
          line-height: 40px;
          background-color: $MainColorScheme;
        }

        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
    }

    input {
      outline: none;
      border: none;
      font-size: 19px;
      padding: 5px 10px;
      border-radius: 5px;
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      border: 1px solid rgba(200, 200, 200, 0.7);
      background-color: rgba(240, 240, 240, 0.7);
    }

    & > button {
      width: 70%;
      border: none;
      border-radius: 15px;
      height: 55px;
      color: white;
      margin: 35px auto 0 auto;
      line-height: 40px;
      font-size: 17px;
      font-weight: 600;
      background-color: $MainColorScheme;
    }

    width: 90%;
    max-width: 600px;
    padding: 25px 30px;
    box-sizing: border-box;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(38px) saturate(200%);
    -webkit-backdrop-filter: blur(38px) saturate(200%);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0);
    box-shadow: 0 8.5px 17px rgba(0, 0, 0, 0.25);
  }

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
</style>
