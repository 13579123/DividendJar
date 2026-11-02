import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "../redis/redis.service.js";

// 实时股票数据
export class StockRealTime {
  "t": string = "2026-10-30 15:35:20"
  "p": number = 1.00
  "pc": number = 1.00
  "ud": number = 1.00
  "v": number = 1.00
  "cje": number = 1.00
  "zf": number = 1.00
  "hs": number = 1.00
  "pe": number = 1.00
  "lb": number = 1.00
  "fm": number = 1.00
  "h": number = 1.00
  "l": number = 1.00
  "o": number = 1.00
  "yc": number = 1.00
  "sz": number = 1.00
  "lt": number = 1.00
  "zs": number = 1.00
  "sjl": number = 1.00
  "zdf60": number = 1.00
  "zdfnc": number = 1.00
}

// 股票数据
export class StockData {
  "ei": string = "SZ"
  "ii": string = "000001"
  "name": string = "平安银行"
  "od": string = "1991-04-03"
  "pc": number = 11.540000000000001
  "up": number = 12.69
  "dp": number = 10.39
  "fv": number = 19405684991.0
  "tv": number = 19405918198.0
  "pk": number = 0.01
  "is": number = 0
}

// 公司信息
export class CompanyData {
  "name": string = "平安银行股份有限公司"
  "ename": string = "Ping An Bank Co.,Ltd."
  "market": string = "深圳证券交易所"
  "ldate": string = "1991-04-03"
  "sprice": string = "40.00"
  "principal": string = "--"
  "rdate": string = "1987-12-22"
  "rprice": string = "1940590万元(CNY)"
  "instype": string = "股份制商业银行"
  "organ": string = "民营企业"
  "secre": string = "周强"
  "phone": string = "0755-82080387"
  "sphone": string = "0755-82080387"
  "fax": string = "0755-82080386"
  "sfax": string = "0755-82080386"
  "email": string = "PAB_db@pingan.com.cn"
  "semail": string = "PAB_db@pingan.com.cn"
  "site": string = "http://www.bank.pingan.com"
  "post": string = "518001,518033"
  "infosite": string = "--"
  "oname": string = "S深发展A 深发展A 平安银行"
  "addr": string = "广东省深圳市罗湖区深南东路5047号"
  "oaddr": string = "中国广东省深圳市福田区益田路5023号平安金融中心B座"
  "desc": string = "本行系在对深圳经济特区原六家信用社改组的同"
  "bscope":string =  "人民币、外币存贷款;国际、国内结算;票据贴现;外汇买卖;提供担保及信用证服务;提供保管箱服务等。"
  "idea":string = "所属概念板块"
  "printype":string =  "--"
  "referrer":string =  "--"
  "putype":string =  "--"
}

// 股票完整信息
export class StockCompleteData {
  realTime: StockRealTime = new StockRealTime
  company: CompanyData = new CompanyData
  stockData: StockData = new StockData
}

@Injectable()
export class Biyi_ApiService {

  constructor(
    private configService: ConfigService,
    private redisService: RedisService
  ) {
    // 读取 api key 列表
    this.api_key_list = JSON.parse(this.configService.get("BIYI_API_KEYS") as string)
  }

  // 所有api key
  protected api_key_list = []

  // 已经无法使用的api key
  protected unable_api_key_set = new Set<string>()

  // 最后一次设置非法api key时间
  protected last_unable_api_key_date = new Date()

  // 发送请求
  protected sendRequest<T>(call: (apikey: string) => Promise<T>) {
    // 没有缓存 递归获取数据
    const getData = async () => {
      const apiKey = this.getApiKey()
      try {
        return await call(apiKey)
      } catch (e) {
        console.log(e)
        if (e instanceof SyntaxError) {
          throw new HttpException("错误的股票代码", HttpStatus.OK)
        }
        if (e instanceof HttpException)
          throw e
        // 记录无效api
        this.unable_api_key_set.add(apiKey)
        // 递归直到可用的 api key
        return getData()
      }
    }
    return getData()
  }

  // 获取有效的api key
  protected getApiKey() {
    // 当天时间
    const nowDate = new Date
    // 已经不是同一天了
    if (new Date().getDate() !== this.last_unable_api_key_date.getDate()) {
      this.unable_api_key_set.clear()
      this.last_unable_api_key_date = nowDate
    }
    // 返回一个可用的api
    for (let i = 0; i < this.api_key_list.length; i++) {
      const key = this.api_key_list[i];
      if (!this.unable_api_key_set.has(key)) return key
    }
    throw new HttpException("没有可用的license", HttpStatus.OK)
  }

  // 获取公司基本信息
  async getCompany(code: string): Promise<CompanyData> {
    // 有缓存拿缓存
    let stockData = await this.redisService.get(["stock", "company", code])
    if (stockData) return stockData as any
    return this.sendRequest<CompanyData>(async (apikey) => {
      const response = await fetch(`https://api.biyingapi.com/hscp/gsjj/${code}/${apikey}`)
      const dataResponse = await response.json()
      if (response.status === 422) {
        throw new HttpException("错误的股票代码", HttpStatus.OK)
      }
      if (response.status !== HttpStatus.OK) throw "无效的apikey"
      // 缓存数据
      await this.redisService.set(["stock", "company", code], dataResponse, 60 * 60 * 24)
      // 返回数据
      return dataResponse
    })
  }

  // 获取股票完整信息
  async getStockCompleteData(code: string) {
    const data = new StockCompleteData
    data.stockData = await this.getStockData(code)
    data.company = await this.getCompany(code)
    data.realTime = await this.getStockRealTimeData(code)
    return data
  }

  // 获取股票基本数据
  async getStockData(code: string): Promise<StockData> {
    // 有缓存拿缓存
    let stockData = await this.redisService.get(["stock", "data", code])
    if (stockData) return stockData as any
    return this.sendRequest<StockData>(async (apikey) => {
      const response = await fetch(`https://api.biyingapi.com/hsstock/instrument/${code}/${apikey}`)
      const dataResponse = await response.json()
      if (response.status === 422) {
        throw new HttpException("错误的股票代码", HttpStatus.OK)
      }
      if (response.status !== HttpStatus.OK) throw "无效的apikey"
      // 缓存数据
      await this.redisService.set(["stock", "data", code], dataResponse, 60 * 60 * 24)
      // 返回数据
      return dataResponse
    })
  }

  // 获取实时数据
  async getStockRealTimeData(code: string): Promise<StockRealTime> {
    // 有缓存拿缓存
    let stockData = await this.redisService.get(["stock", "realtime", code])
    if (stockData) return stockData as any
    return this.sendRequest<StockRealTime>(async (apikey) => {
      const response = await fetch(`https://api.biyingapi.com/hsrl/ssjy/${code}/${apikey}`)
      const dataResponse = await response.json()
      console.log(dataResponse)
      if (response.status === 422) {
        throw new HttpException("错误的股票代码", HttpStatus.OK)
      }
      if (response.status !== HttpStatus.OK) throw "无效的apikey"
      // 缓存数据
      await this.redisService.set(["stock", "realtime", code], dataResponse, 60 * 5)
      // 返回数据
      return dataResponse
    })
  }

}