<template>
  <div id="main-holdings-page">
    <!-- 板块仓位 -->
    <div class="bk-cw">
      <div class="bk">
        <div class="bk-item" v-for="(cw, index) in bkcw.bk" :key="cw.k">
          <div class="dot" :style="{ backgroundColor: getColorByIndex(index) }"></div>
          <span>{{ cw.k }} {{ normalizeFloat((cw.v / bkcw.toast) * 100) }}%</span>
        </div>
      </div>
      <div class="cw">
        <div class="cw-item" v-for="(cw, index) in bkcw.bk" :key="cw.k"
          :style="{ backgroundColor: getColorByIndex(index), width: (cw.v / bkcw.toast) * 100 + '%' }"></div>
      </div>
    </div>
    <div class="card" v-for="holdings in holdingsList" :key="holdings.id">
      <div class="ei-bscope-ii">
        <span class="ei">{{ completeStockDataMap.get(holdings.code)?.stockData.ei }}</span>
        ·
        <span class="bscope">{{ getIndustryName(completeStockDataMap.get(holdings.code)?.industry) }}</span>
        ·
        <span class="ii">{{ completeStockDataMap.get(holdings.code)?.stockData.ii }}</span>
      </div>
      <div class="base-data">
        <div class="name"> {{ getCompanyName(completeStockDataMap.get(holdings.code)?.company) }} </div>
        <div class="price">
          ￥ {{
            completeStockDataMap.get(holdings.code)?.realTime.p || completeStockDataMap.get(holdings.code)?.realTime.yc
          }}
        </div>
      </div>
      <div class="coast">
        <div> {{ holdings.count }}股 @ {{ normalizeFloat(holdings.cost) }}元 </div>
        <div>
          市值: {{ normalizeFloat(
            (completeStockDataMap.get(holdings.code)?.realTime.p
              || completeStockDataMap.get(holdings.code)?.realTime.yc
              || 1) * holdings.count
          ) }}
        </div>
      </div>
      <div class="profit">
        <!-- 盈利情况 -->
        <div :class="['number', getProfit(holdings) > 0 ? 'red-color' : 'green-color']">
          {{ getProfit(holdings) > 0 ? "+" : "" }}{{ normalizeFloat(getProfit(holdings)) }}
        </div>
        <!-- 盈利情况 -->
        <div :class="['percentage', getProfit(holdings) > 0 ? 'red-color' : 'green-color']">
          {{ getProfit(holdings) > 0 ? "+" : "" }}
          {{ normalizeFloat(getProfit(holdings) / (holdings.count * (holdings.cost > 0 ? holdings.cost :
            (completeStockDataMap.get(holdings.code)?.realTime.p
              || completeStockDataMap.get(holdings.code)?.realTime.yc || 1))) * 100) }}%
        </div>
      </div>
      <div class="line"></div>
      <div class="dividend">
        近三年平均成本股息率
        <span style="font-weight: 600;">{{
          holdings.cost > 0 ?
            normalizeFloat((getThreeYearHistoryDividend(holdings) / 3) / (holdings.cost) * 100)
            :
            "--"
        }}%</span> ，
        近三年平均现价股息率
        <span style="font-weight: 600;">{{
          normalizeFloat((getThreeYearHistoryDividend(holdings) / 3) /
            (completeStockDataMap.get(holdings.code)?.realTime.p || completeStockDataMap.get(holdings.code)?.realTime.yc
              ||
              1) * 100)
        }}%</span>
      </div>
    </div>
  </div>
  <!-- 操作界面 -->
  <div class="operation">
    <div class="deal" @click="router.push('/deal')"> 交易 </div>
  </div>

</template>

<script setup lang="ts">
import router from '@/router';
import { api, request } from '@/util/api';
import { normalizeFloat } from '@/util/normalize';
import type { CompanyData, Industry, StockCompleteData } from '@/util/type/BiYi_Type';
import type { Holdings } from '@/util/type/Holdings';
import { ElLoading, ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';

// 持仓列表
const holdingsList = ref<Holdings[]>([])

// 公司基本信息
const completeStockDataMap = ref(new Map<string, StockCompleteData>())

onMounted(() => {
  getHoldingsList()
})

// 板块仓位
const bkcw = computed<{ toast: number, bk: { k: string, v: number }[] }>(() => {
  let toastCw = 0
  const cwMap = new Map<string, number>()
  holdingsList.value.forEach(holdings => {
    const stockData = completeStockDataMap.value.get(holdings.code)
    if (!stockData) return
    const p = holdings.count * (stockData.realTime.p || stockData.realTime.yc)
    toastCw += p
    cwMap.set(getIndustryName(stockData.industry), p)
  })
  const result: { k: string, v: number }[] = []
  cwMap.forEach((v, k) => result.push({ k, v }))
  return { toast: toastCw, bk: result.sort((a, b) => b.v - a.v) }
})

// 根据公司历史名称获取简称
function getCompanyName(company: CompanyData | undefined) {
  if (!company) return ""
  if (company.oname !== "--") {
    const historyName = company.oname.split(" ")
    return historyName[historyName.length - 1]
  }
  return company.name.replace("股份有限公司", "")
}

// 根据公司行业获取简称
function getIndustryName(industrys: Industry[] | undefined) {
  if (!industrys || !industrys[0]) return "综合"
  const ind = industrys[0].name.split("-")
  return ind[ind.length - 1] || "综合"
}

// 获取金三年每股分红金额
function getThreeYearHistoryDividend(holdings: Holdings) {
  const data = completeStockDataMap.value.get(holdings.code)
  if (!data) return 0
  let toastDividend = 0
  const nowYear = new Date().getFullYear()
  data.dividend.forEach(dividend => {
    const chaYear = nowYear - new Date(dividend.rdate || dividend.sdate || dividend.edate).getFullYear()
    if (chaYear > 0 && chaYear <= 3) toastDividend += parseFloat(dividend.send) || 0
  })
  return toastDividend / 10
}

// 获取盈利情况
function getProfit(holdings: Holdings) {
  const data = completeStockDataMap.value.get(holdings.code)
  if (!data) return 0
  return (data.realTime.p || data.realTime.yc) * holdings.count - holdings.cost * holdings.count
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

// 根据一个index获取一个颜色
function getColorByIndex(index: number) {
  const colors = ["rgb(241, 88, 77)", "rgb(47, 93, 191)", "rgb(191, 121, 47)", "rgb(47, 191, 145)", "#bf2f9b"]
  if (index >= colors.length) {
    index = index % colors.length
  }
  return colors[index]
}

</script>

<style scoped lang="scss">
#main-holdings-page {

  .bk-cw {
    .bk {
      .bk-item {
        .dot {
          margin-right: 5px;
          width: 10px;
          height: 10px;
          border-radius: 100%;
        }

        align-items: center;
        padding-right: 10px;
        display: flex;
        padding-bottom: 10px;
      }

      display: flex;
      flex-wrap: wrap;
    }

    .cw {
      .cw-item {
        height: 100%;
      }

      display: flex;
      width: 100%;
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
      background-color: #efefef;
    }

    background-color: white;
    width: 90%;
    padding: 20px 15px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 0 auto;
    margin-bottom: 20px;
    box-shadow: 0 0 5px 0.5px rgba(0, 0, 0, 0.1);
  }

  .card {
    .ei-bscope-ii {
      .ei {
        color: $MainColorScheme;
      }

      font-size: 14px;
      font-weight: 600;
    }

    .base-data {
      padding-top: 5px;
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

    .profit {
      .number {
        font-size: 19px;
        font-weight: 600;
      }

      .percentage {}

      .red-color {
        color: $RedColorScheme;
      }

      .green-color {
        color: $GreenColorScheme;
      }

      padding-top: 10px;
      display: flex;
      justify-content: space-between;
    }

    .line {
      padding-top: 10px;
      border-bottom: 2px solid rgba(200, 200, 200, 0.2);
    }

    .dividend {
      padding-top: 10px;
      font-size: 14px;
      color: $MainColorScheme;
    }

    background-color: white;
    width: 90%;
    padding: 20px 15px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 0 auto;
    margin-bottom: 20px;
    box-shadow: 0 0 5px 0.5px rgba(0, 0, 0, 0.1);
  }

  padding-top: 20px;
  padding-bottom: 100px;
}

.operation {
  .deal {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 19px;
    background-color: $MainColorScheme;
    border-radius: 5px;
    padding: 5px 15px;
  }

  position: fixed;
  right: 10px;
  bottom: 100px;
}
</style>