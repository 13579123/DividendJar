import { Controller, Get, Req, Headers, Post, Body, Param } from "@nestjs/common";
import { ThirdService } from "./third.service.js";
import { MailerService } from "@nestjs-modules/mailer";
import { generateRandomString, HttpResult } from "../../util/index.js";
import { RedisService } from "../../plugin/redis/redis.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { getLoginCodDto } from "./dto/getLoginCode.dto.js";
import { Biyi_ApiService, CompanyData, Industry, StockCompleteData, StockData, StockRealTime } from "../../plugin/biyi_api/biyi_api.service.js";

@ApiTags("三方")
@Controller('third')
export class ThirdController {

  constructor(
    private thirdService: ThirdService,
    private redisService: RedisService,
    private biyiApiService: Biyi_ApiService,
  ) {
  }

  @Get("company/:code")
  @ApiOperation({ summary: '获取公司信息' })
  @ApiResponse({ example: new HttpResult(new CompanyData) })
  async company(@Param("code") code: string) {
    const data = await this.biyiApiService.getCompany(code)
    return new HttpResult(data, "获取股票数据成功")
  }

  @Get("stockRealTimeData/:code")
  @ApiOperation({ summary: '获取股票实时数据' })
  @ApiResponse({ example: new HttpResult(new StockRealTime) })
  async stockRealTimeData(@Param("code") code: string) {
    const data = await this.biyiApiService.getStockRealTimeData(code)
    return new HttpResult(data, "获取股票数据成功")
  }

  @Get("stockData/:code")
  @ApiOperation({ summary: "股票基本信息" })
  @ApiResponse({ example: new HttpResult(new StockData) })
  async stockData(@Param("code") code: string) {
    const data = await this.biyiApiService.getStockData(code)
    return new HttpResult(data, "获取股票数据成功")
  }

  @Get("industry/:code")
  @ApiOperation({ summary: "股票行业信息" })
  @ApiResponse({ example: new HttpResult([new Industry]) })
  async industry(@Param("code") code: string) {
    const data = await this.biyiApiService.getIndustry(code)
    return new HttpResult(data, "获取股票数据成功")
  }

  @Get("stockCompleteData/:code")
  @ApiOperation({ summary: "股票完整信息" })
  @ApiResponse({ example: new HttpResult(new StockCompleteData) })
  async stockCompleteData(@Param("code") code: string) {
    const data = await this.biyiApiService.getStockCompleteData(code)
    return new HttpResult(data, "获取股票数据成功")
  }

  @Post("getLoginCode")
  @ApiOperation({ summary: '获取登录验证码' })
  @ApiResponse({ example: new HttpResult(null) })
  async getLoginCode(@Body() body: getLoginCodDto) {
    const email = body.email
    const code = generateRandomString(5).toLowerCase()
    this.redisService.set(["login", email], code, 60 * 5)
    this.thirdService.sendMailer(email, "登录验证码", "验证码为 " + code + " 验证码5分钟有效，请尽快使用")
    return new HttpResult("", "获取验证码成功")
  }

}