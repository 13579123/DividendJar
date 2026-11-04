<template>
  <div id="main-index-page">
    <div class="top-area card">
      <div class="msg">
        <div class="day">
          <div class="dot">
            <div class="dot-out">
              <div class="dot-in"></div>
            </div>
          </div>
          攒股分红第
          <i style="font-size: 16px;">
            {{ Math.ceil((Date.now() - new Date(accountData?.createTime || "").getTime()) / 1000 / 60 / 60 / 24) }}
          </i>
          &nbsp;天
        </div>
      </div>
      <div class="toast">
        <div class="toast-market-value">
          总市值: {{ showOrHidden.marketValue ? normalizeFloat(toastMarketValue) : '****' }}
        </div>
        <div class="show-or-hidden" @click="showOrHidden.marketValue = !showOrHidden.marketValue">
          <svg t="1793760125503" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="5309" width="22" height="22">
            <path
              d="M515.2 224c-307.2 0-492.8 313.6-492.8 313.6s214.4 304 492.8 304 492.8-304 492.8-304S822.4 224 515.2 224zM832 652.8c-102.4 86.4-211.2 140.8-320 140.8s-217.6-51.2-320-140.8c-35.2-32-70.4-64-99.2-99.2-6.4-6.4-9.6-12.8-16-19.2 3.2-6.4 9.6-12.8 12.8-19.2 25.6-35.2 57.6-70.4 92.8-102.4 99.2-89.6 208-144 329.6-144s230.4 54.4 329.6 144c35.2 32 64 67.2 92.8 102.4 3.2 6.4 9.6 12.8 12.8 19.2-3.2 6.4-9.6 12.8-16 19.2C902.4 585.6 870.4 620.8 832 652.8z"
              p-id="5310" fill="#8a8a8a"></path>
            <path
              d="M512 345.6c-96 0-169.6 76.8-169.6 169.6 0 96 76.8 169.6 169.6 169.6 96 0 169.6-76.8 169.6-169.6C681.6 422.4 604.8 345.6 512 345.6zM512 640c-67.2 0-121.6-54.4-121.6-121.6 0-67.2 54.4-121.6 121.6-121.6 67.2 0 121.6 54.4 121.6 121.6C633.6 582.4 579.2 640 512 640z"
              p-id="5311" fill="#8a8a8a"></path>
          </svg>
        </div>
      </div>
      <div class="detail">
        总市值 · {{ holdingsList.length }}只持仓 · {{ stockCount }}股
      </div>
      <div class="profit">
        总收益 &nbsp;
        <span :class="[profit > 0 ? 'red' : 'green']">
          {{ showOrHidden.profit ? normalizeFloat(profit) : "****" }}({{ normalizeFloat((profit / cost) * 100) }}%)
        </span>
        <span class="show-or-hidden" @click="showOrHidden.profit = !showOrHidden.profit">
          <svg t="1793761942018" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="5607" width="16" height="16">
            <path
              d="M515.2 224c-307.2 0-492.8 313.6-492.8 313.6s214.4 304 492.8 304 492.8-304 492.8-304S822.4 224 515.2 224zM832 652.8c-102.4 86.4-211.2 140.8-320 140.8s-217.6-51.2-320-140.8c-35.2-32-70.4-64-99.2-99.2-6.4-6.4-9.6-12.8-16-19.2 3.2-6.4 9.6-12.8 12.8-19.2 25.6-35.2 57.6-70.4 92.8-102.4 99.2-89.6 208-144 329.6-144s230.4 54.4 329.6 144c35.2 32 64 67.2 92.8 102.4 3.2 6.4 9.6 12.8 12.8 19.2-3.2 6.4-9.6 12.8-16 19.2C902.4 585.6 870.4 620.8 832 652.8z"
              p-id="5608" fill="#8a8a8a"></path>
            <path
              d="M512 345.6c-96 0-169.6 76.8-169.6 169.6 0 96 76.8 169.6 169.6 169.6 96 0 169.6-76.8 169.6-169.6C681.6 422.4 604.8 345.6 512 345.6zM512 640c-67.2 0-121.6-54.4-121.6-121.6 0-67.2 54.4-121.6 121.6-121.6 67.2 0 121.6 54.4 121.6 121.6C633.6 582.4 579.2 640 512 640z"
              p-id="5609" fill="#8a8a8a"></path>
          </svg>
        </span>
      </div>
      <div class="line"></div>
      <div class="industry">
        <div class="year-industry">
          <div> 预计年分红(预计股息) </div>
          <div> 5333.05<span>(3.33%)</span> </div>
        </div>
        <div class="year-industry-percent">
          <div> 现价股息率(成本股息率) </div>
          <div> 5.33%<span>(3.33%)</span> </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/util/api';
import { normalizeFloat } from '@/util/normalize';
import type { Account } from '@/util/type/Account';
import type { StockCompleteData } from '@/util/type/BiYi_Type';
import type { Holdings } from '@/util/type/Holdings';
import { ElLoading, ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';

// 用户信息
const accountData = ref<Account>()

// 持仓列表
const holdingsList = ref<Holdings[]>([])

// 股票完整信息
const completeStockDataMap = ref(new Map<string, StockCompleteData>())

// 是否展示数据
const showOrHidden = reactive({ marketValue: true, profit: true })

onMounted(() => {
  // 加载动画
  const loadingInstance = ElLoading.service()
  api.account.accountData()
    .then(result => {
      if (!result.data.success) return ElMessage.warning(result.data.message)
      accountData.value = result.data.response
    })
    .finally(() => loadingInstance.close())
})

onMounted(() => {
  // 加载动画
  const loadingInstance = ElLoading.service()
  api.stock.holdings()
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
})

// 总股数
const stockCount = computed(() => {
  let value = 0
  holdingsList.value.forEach(ho => value += ho.count)
  return value
})

// 总市值
const toastMarketValue = computed(() => {
  let value = 0
  holdingsList.value.forEach(ho => {
    const stockData = completeStockDataMap.value.get(ho.code)
    if (!stockData) return
    value += ho.count * (stockData.realTime.p || stockData.realTime.yc)
  })
  return value
})

// 总盈利
const profit = computed(() => {
  let result = 0
  holdingsList.value.forEach(holdings => {
    const data = completeStockDataMap.value.get(holdings.code)
    if (!data) return 0
    result += (data.realTime.p || data.realTime.yc) * holdings.count - holdings.cost * holdings.count
  })
  return result
})

// 总成本
const cost = computed(() => {
  let result = 0
  holdingsList.value.forEach(holdings => result += holdings.cost * holdings.count)
  return result
})


</script>

<style scoped lang="scss">
@keyframes dotHeart {
  0% {
    width: 14px;
    height: 14px;
  }

  100% {
    width: 10px;
    height: 10px;
  }
}

#main-index-page {

  .show-or-hidden {
    display: flex;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
    justify-content: center;
    border-radius: 100%;
    background-color: rgba($color: #ddd, $alpha: 0.6);
  }

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

  .top-area {

    .msg {
      .day {

        .dot {

          .dot-in,
          .dot-out {
            border-radius: 100%;
          }

          .dot-in {
            width: 7px;
            height: 7px;
            background-color: rgba($color: $MainColorScheme, $alpha: 0.7);
          }

          .dot-out {
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba($color: $MainColorScheme, $alpha: 0.3);
            animation: dotHeart 1s infinite forwards alternate-reverse;
            margin: 0 auto;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }

          width: 14px;
          height: 14px;
          margin-right: 5px;

        }

        font-size: 14px;
        color: $MainColorScheme;
        padding: 5px 15px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        background: linear-gradient(to right, rgba($color: $MainColorScheme, $alpha: 0.15), rgba($color: $MainColorScheme, $alpha: 0.05));
        border: 1px solid rgba($color: $MainColorScheme, $alpha: 0.6);
      }

      display: flex;
      padding-bottom: 20px;
    }

    .toast {
      .toast-market-value {
        color: black;
        font-size: 20px;
        font-weight: 600;
      }

      .show-or-hidden {
        width: 27px;
        height: 27px;
      }

      display: flex;
      align-items: center;
    }

    .detail,
    .profit {
      font-size: 14px;
      padding-top: 10px;
    }

    .profit {

      .show-or-hidden {
        width: 20px;
        height: 20px;
      }

      span {
        font-size: 16px;
        font-weight: 600;
      }

      .red {
        color: $RedColorScheme;
      }

      .green {
        color: $GreenColorScheme;
      }

      display: flex;
      align-items: center;
    }

    .line {
      margin: 15px 0;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    }

    .industry {
      .year-industry {
        margin-right: 25px;
      }

      font-size: 15px;
      display: flex;
    }
  }

  padding-top: 20px;
  padding-bottom: 100px;
}
</style>