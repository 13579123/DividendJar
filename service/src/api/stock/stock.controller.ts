import { Controller, Get, Req, Headers, Post, Body, HttpException, HttpStatus, UseGuards, Param } from "@nestjs/common";
import { RedisService } from "../../plugin/redis/redis.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HttpResult } from "../../util/index.js";
import { JWTService } from "../../plugin/jwt/jwt.service.js";
import { Roles } from "../../decorator/roles.decorator.js";
import { DataSource } from "typeorm";
import { BuyStockDto } from "./dto/buyStock.dto.js";
import { Slip, SlipType } from "../../entity/table/Slip.js";
import { Holdings } from "../../entity/table/Holdings.js";
import { HoldingsService } from "../../entity/service/Holdings.service.js";
import { Attention } from "../../entity/table/Attention.js";
import { AccountService } from "../../entity/service/Account.service.js";
import { Biyi_ApiService, StockRealTime } from "../../plugin/biyi_api/biyi_api.service.js";

@ApiTags("股票操作")
@Controller('stock')
export class StockController {

  constructor(
    private redisService: RedisService,
    private jwtService: JWTService,
    private dataSource: DataSource,
    private holdingsService: HoldingsService,
    private accountService: AccountService,
    private biyiApiService: Biyi_ApiService
  ) {
  }

  @Get("holdings")
  @Roles(0)
  @ApiOperation({ summary: "持仓查询" })
  @ApiResponse({ example: new HttpResult([new Holdings], "获取成功") })
  async holdings(@Headers("token") token: string) {
    const email = this.jwtService.verify(token) as string
    const holdings = await this.holdingsService.findAllHoldings(email)
    return new HttpResult(holdings, "查询成功")
  }

  @Get("attentionList")
  @Roles(0)
  @ApiOperation({ summary: "获取关注股票的列表" })
  @ApiResponse({ example: new HttpResult([new Attention], "获取成功") })
  async attentionList(@Headers("token") token: string) {
    const email = this.jwtService.verify(token) as string
    return new HttpResult(await this.accountService.findAttention(email), "获取成功")
  }

  @Post("buyStock")
  @Roles(0)
  @ApiOperation({ summary: "买入股票" })
  @ApiResponse({ example: new HttpResult(null, "买入成功") })
  async buyStock(@Headers("token") token: string, @Body() body: BuyStockDto) {
    const email = this.jwtService.verify(token) as string
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction(); // 开启事物
      // 添加买卖记录
      const slip = queryRunner.manager.create(Slip)
      slip.type = SlipType.BUY
      slip.coast = body.cost
      slip.code = body.code
      slip.email = email
      slip.charge = body.charge
      slip.count = body.count
      // 添加记录
      await queryRunner.manager.save(slip)
      // 修改持仓 平摊成本
      let holdings = await queryRunner.manager.findOne(Holdings, { where: { email, code: body.code } })
      let isUpdate = true
      if (!holdings) {
        isUpdate = false
        holdings = queryRunner.manager.create(Holdings)
      }
      holdings.email = email
      holdings.code = body.code
      // 原来的总成本
      let allCost = holdings.cost * holdings.count
      const cost = body.count * body.cost
      const charge = cost * body.charge < 5 ? 5 : cost * body.charge
      allCost += cost + charge
      holdings.count += body.count
      holdings.cost = allCost / holdings.count
      // 是否已经有持仓，有责更新，没有则创建
      if (isUpdate) await queryRunner.manager.update(Holdings, holdings.id, holdings)
      else await queryRunner.manager.save(Holdings, holdings)
      // 提交
      await queryRunner.commitTransaction()
      return new HttpResult(null, "买入成功")
    } catch (e) {
      console.error(e)
      await queryRunner.rollbackTransaction()
      throw new HttpException("", HttpStatus.OK);
    } finally {
      await queryRunner.release()
    }
  }

}