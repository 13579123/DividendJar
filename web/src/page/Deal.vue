<template>
  <div id="deal-page">
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
    <h3 style="display: flex;justify-content: center;color: black;margin-top: 10px;"> 买卖股票 </h3>
    <div class="select-code">
      <el-autocomplete v-model="stockCode" placeholder="股票代码" style="height: 40px;"
        :fetch-suggestions="querySearchAsync" @select="stockCode" />
    </div>
    <div class="panel">
      <div class="cost">
        <div class="title"> 股票价格： </div>
        <el-input v-model="stockCost" type="number" placeholder="" />
      </div>
      <div class="count">
        <div class="title"> 股票数量： </div>
        <el-input v-model="stockCount" type="number" placeholder="" />
      </div>
      <div class="charge">
        <div class="title"> 手续费(最低五元，默认万一)： </div>
        <el-input v-model="stockCharge" type="number" placeholder="" />
      </div>
      <div class="buttons">
        <el-button type="primary" class="buy" @click="buyStock">
          买入
        </el-button>
        <el-button type="primary" class="sell" @click="sellStock">
          卖出
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import stockList from "@/assets/json/stock_list.json"
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { api } from '@/util/api';

const stockCode = ref("")

const stockCost = ref(0)

const stockCount = ref(0)

const stockCharge = ref(0.0001)

const router = useRouter()

function querySearchAsync(queryString: string, cb: Function) {
  const result: { value: string }[] = []
  stockList.forEach(v => {
    if (!queryString) return
    if (queryString === v.mc || v.mc.startsWith(queryString) || v.dm === queryString || v.dm.startsWith(queryString)) {
      result.push({ value: v.dm + " -- " + v.mc })
    }
  })
  cb(result)
}

async function buyStock() {
  const code = (stockCode.value.split("--")[0] || "").trim()
  if (!code) return ElMessage.warning("股票代码不能为空")
  if (stockCount.value <= 0) return ElMessage.warning("买卖不允许为0")
  ElMessageBox.confirm(
    `确定要以 ${stockCost.value}元/股 的价格购买 ${stockCode.value} 共 ${stockCount.value} 股吗?`,
    "确认",
    { cancelButtonText: "取消", confirmButtonText: "确定" }
  ).then(() => {
    const loading = ElLoading.service()
    api.stock.buyStock(code, stockCost.value, stockCount.value, stockCharge.value)
      .then(result => {
        if (!result.data.success) return ElMessage.warning(result.data.message)
        ElMessage.success(result.data.message)
        router.back()
      }).finally(() => {
        loading.close()
      })
  }).catch(e => e)
}

async function sellStock() {
  const code = (stockCode.value.split("--")[0] || "").trim()
  if (!code) return ElMessage.warning("股票代码不能为空")
  if (stockCount.value <= 0) return ElMessage.warning("买卖不允许为0")
  const loading = ElLoading.service()
  ElMessageBox.confirm(
    `确定要以 ${stockCost.value}元/股 的价格卖出 ${stockCode.value} 共 ${stockCount.value} 股吗?`,
    "确认",
    { cancelButtonText: "取消", confirmButtonText: "确定" }
  ).then(() => {
    api.stock.sellStock(code, stockCost.value, stockCount.value, stockCharge.value)
      .then(result => {
        if (!result.data.success) return ElMessage.warning(result.data.message)
        ElMessage.success(result.data.message)
        router.back()
      }).finally(() => {
        loading.close()
      })
  }).catch(e => e)
}

</script>

<style lang="scss">
#deal-page {
  .return {
    height: 60px;
    display: flex;
    padding: 0 10px;
    box-sizing: border-box;
    box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: 0.2);
    align-items: center;
    background-color: white;
  }

  .select-code {
    width: 95%;
    margin: 0 auto;
    margin-top: 20px;
  }

  .panel {

    .count,
    .cost,
    .charge {
      .title {
        padding-bottom: 5px;
      }
    }

    .count,
    .charge {
      padding-top: 20px;
    }

    .buttons {
      .buy {
        background-color: $MainColorScheme;
      }

      .sell {
        background-color: $GreenColorScheme;
      }

      padding-top: 30px;
    }

    width: 95%;
    margin: 30px auto 0 auto;
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: 0.2);
  }
}
</style>