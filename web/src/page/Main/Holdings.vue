<template>
  <div id="main-holdings-page">
    <div class="card" v-for="holdings in holdingsList" :key="holdings.id">
      <div class="name">
        {{ getCompanyName(companyMap.get(holdings.code)) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api, request } from '@/util/request';
import type { CompanyData } from '@/util/type/BiYi_Type';
import type { Holdings } from '@/util/type/Holdings';
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const holdingsList = ref<Holdings[]>([])

// 公司基本信息
const companyMap = ref(new Map<string, CompanyData>())

onMounted(() => {
  getHoldingsList()
})

// 根据公司历史名称获取简称
function getCompanyName(company: CompanyData | undefined) {
  if (!company) return ""
  if (company.oname) {
    const historyName = company.oname.split(" ")
    return historyName[historyName.length - 1]
  }
  return company.name
}

// 获取持仓
async function getHoldingsList() {
  // 加载动画
  const loadingInstance = ElLoading.service({
    lock: true, // 锁定屏幕
    text: '加载中...', // 自定义文字
    background: 'rgba(0, 0, 0, 0.7)', // 背景颜色
    fullscreen: true // 全屏模式
  })
  await api.stock.holdings()
    .then((result) => {
      if (!result.data.success) {
        ElMessage.warning(result.data.message)
        return
      }
      holdingsList.value = result.data.response
      const allPromise: Promise<any>[] = []
      result.data.response.forEach((stockData) => {
        allPromise.push(new Promise(res => {
          api.third.company(stockData.code)
            .then((result) => {
              if (!result.data.success) {
                ElMessage.warning(result.data.message)
                return
              }
              companyMap.value.set(stockData.code, result.data.response)
              res(void 0)
            })
        }))
      })
      return Promise.all(allPromise)
    })
    .finally(() => loadingInstance.close())
}

</script>

<style scoped lang="scss">
#main-holdings-page {
  .card {
    .name {
      font-size: 19px;
      font-weight: 600;
    }

    background-color: white;
    width: 95%;
    padding: 20px 15px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 0 auto;
    margin-bottom: 20px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
  }

  padding-top: 20px;
  padding-bottom: 100px;
}
</style>