<template>
  <div id="main-holdings-page">
    <div class="card" v-for="holdings in holdingsList" :key="holdings.id">
      <div class="base-data">
        <div class="name"> {{ getCompanyName(completeStockDataMap.get(holdings.code)?.company) }} </div>
        <div class="price"> {{ normalizeFloat(holdings.cost) }} </div>
      </div>
      <div class="coast">
        <div> {{ holdings.count }}股 @ {{ normalizeFloat(holdings.cost) }}元 </div>
        <div> 市值: {{ normalizeFloat(holdings.cost * holdings.count) }} </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api, request } from '@/util/api';
import { normalizeFloat } from '@/util/normalize';
import type { CompanyData, StockCompleteData } from '@/util/type/BiYi_Type';
import type { Holdings } from '@/util/type/Holdings';
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

// 持仓列表
const holdingsList = ref<Holdings[]>([])

// 公司基本信息
const completeStockDataMap = ref(new Map<string, StockCompleteData>())

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
        // 获取公司基本信息 实时价格 基本信息
        allPromise.push(new Promise(res => {
          api.third.stockCompleteData(stockData.code)
            .then((result) => {
              if (!result.data.success) {
                ElMessage.warning(result.data.message)
                return
              }
              completeStockDataMap.value.set(stockData.code, result.data.response)
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
    .base-data {
      color: #1f1f1f;
      font-size: 19px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
    }

    .coast {
      div:nth-child(2) {
        color: #0f0f0f;
      }

      padding-top: 5px;
      display: flex;
      justify-content: space-between;
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