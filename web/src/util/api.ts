import axios, { type AxiosResponse } from "axios";
import type { Holdings } from "./type/Holdings";
import type { CompanyData, StockCompleteData, StockRealTime } from "./type/BiYi_Type";
import type { Account } from "./type/Account";
import type { Target } from "./type/Target";

export const request = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
})

request.interceptors.request.use(config => {
  config.headers.set("token", localStorage.getItem(import.meta.env.VITE_LOCAL_TOKEN_KEY))
  return config
})

export class HttpResult<T> {
  message: string
  response: T
  statusCode: number
  success: boolean
  constructor(r: T, msg?: string, code?: number, success: boolean = true) {
    this.response = r
    this.message = msg || "成功 "
    this.statusCode = code || 200
    this.success = success
  }
}

export const api = {

  account: {
    // 登录获取token
    login(data: { email: string, code: string }): Promise<AxiosResponse<HttpResult<{ token: string }>>> {
      return request.post("/account/login", data)
    },
    // 获取用户信息
    accountData(): Promise<AxiosResponse<HttpResult<Account>>> {
      return request.get("/account/accountData")
    },
    // 修改昵称
    changeNickname(nickname: string): Promise<AxiosResponse<HttpResult<null>>> {
      return request.post("/account/changeNickname", { nickname: nickname })
    },
    // 获取目标列表
    userTarget(): Promise<AxiosResponse<HttpResult<Target[]>>> {
      return request.get("/account/userTarget")
    },
    // 添加目标
    addUserTarget(name: string, money: number, icon: number): Promise<AxiosResponse<HttpResult<null>>> {
      return request.post("/account/addUserTarget", { name, money, icon })
    },
    // 修改目标
    changeuserTarget(target: Target): Promise<AxiosResponse<HttpResult<null>>> {
      return request.post("/account/changeuserTarget", target)
    },
    // 删除目标
    deleteUserTarget(id: string): Promise<AxiosResponse<HttpResult<null>>> {
      return request.delete("/account/userTarget/" + id)
    }
  },

  third: {
    // 获取验证码
    getLoginCode(email: string): Promise<AxiosResponse<HttpResult<null>>> {
      return request.post("/third/getLoginCode", { email })
    },
    // 获取股票公司基本信息
    async company(code: string): Promise<AxiosResponse<HttpResult<CompanyData>>> {
      return request.get("/third/company/" + code)
    },
    // 获取实时股票数据
    async stockRealTimeData(code: string): Promise<AxiosResponse<HttpResult<StockRealTime>>> {
      return request.get("/third/stockRealTimeData/" + code)
    },
    // 获取完整股票数据
    async stockCompleteData(code: string): Promise<AxiosResponse<HttpResult<StockCompleteData>>> {
      return request.get("/third/stockCompleteData/" + code)
    },
  },

  stock: {
    // 获取持仓列表
    async holdings(): Promise<AxiosResponse<HttpResult<Holdings[]>>> {
      return request.get("/stock/holdings")
    },
    // 买入股票
    async buyStock(code: string, cost: number, count: number, charge: number): Promise<AxiosResponse<HttpResult<null>>> {
      return request.post("/stock/buyStock", { code, cost: Number(cost), count: Number(count), charge: Number(charge) })
    },
    // 卖出股票
    async sellStock(code: string, cost: number, count: number, charge: number): Promise<AxiosResponse<HttpResult<null>>> {
      return request.post("/stock/sellStock", { code, cost: Number(cost), count: Number(count), charge: Number(charge) })
    }
  }

}