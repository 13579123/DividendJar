import { HttpStatus, Injectable } from "@nestjs/common";
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
    throw new Error("没有可用的license")
  }

  // 获取实时数据
  async getStockRealTimeData(code: string): Promise<StockRealTime> {
    // 有缓存拿缓存
    let stockData = await this.redisService.get(code)
    if (stockData) return stockData as any
    // 没有缓存 递归获取数据
    const getData = async () => {
      const apiKey = this.getApiKey()
      try {
        const response = await fetch(`https://api.biyingapi.com/hsrl/ssjy/${code}/${apiKey}`)
        const dataResponse = await response.json()
        if (response.status !== HttpStatus.OK) throw "无效的apikey"
        // 缓存数据
        await this.redisService.set(code , dataResponse , 60 * 2)
        // 返回数据
        return dataResponse
      } catch(e) {
        // 记录无效api
        this.unable_api_key_set.add(apiKey)
        // 递归直到可用的 api key
        return getData()
      }
    }
    return getData()
  }

}