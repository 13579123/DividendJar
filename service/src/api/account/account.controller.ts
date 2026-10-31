import { Controller, Get, Req, Headers, Post, Body, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { RedisService } from "../../plugin/redis/redis.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginVo } from "./vo/login.vo.js";
import { HttpResult } from "../../util/index.js";
import { JWTService } from "../../plugin/jwt/jwt.service.js";
import { Account } from "../../entity/table/Account.js";
import { Attention } from "../../entity/table/Attention.js";
import { AuthGuard } from "../../guard/auth.guard.js";
import { Roles } from "../../decorator/roles.decorator.js";
import { AccountService } from "../../entity/service/Account.service.js";

@ApiTags("用户数据")
@Controller('account')
export class AccountController {

  constructor(
    private accountService: AccountService,
    private redisService: RedisService,
    private jwtService: JWTService,
  ) {
  }

  @Post("login")
  @ApiOperation({ summary: '用户登录，获取token' })
  @ApiResponse({ example: new HttpResult(new LoginVo("123456")) })
  async login(@Body() body: LoginDto): Promise<HttpResult<LoginVo>> {
    const { email, code } = body
    const sureCode = await this.redisService.get(["login", email])
    if (code !== sureCode) throw new HttpException("验证码错误", HttpStatus.OK)
    // 删除redis键
    await this.redisService.del(["login", email])
    // 判断是否存在角色
    const account = await this.accountService.findAccount(email)
    // 不存在则创建
    if (!account) await this.accountService.createAccount(email)
    // 返回token
    const token = this.jwtService.create(email)
    return new HttpResult(new LoginVo(token) , "登陆成功")
  }

  @Get("accountData")
  @Roles(0)
  @ApiOperation({ summary: '根据token获取用户信息' })
  @ApiResponse({ example: new HttpResult(new Account , "获取成功") })
  async accountData(@Headers("token") token: string) {
    let email: string = this.jwtService.verify(token) as string
    const account = await this.accountService.findAccount(email)
    if (!account) return new HttpResult(null , "用户不存在" , HttpStatus.OK , false)
    return new HttpResult(account , "获取成功")
  }

  @Get("attentionList")
  @Roles(0)
  @ApiOperation({ summary: "获取关注股票的列表" })
  @ApiResponse({ example: new HttpResult([new Attention] , "获取成功") })
  async attentionList(@Headers("token") token: string) {
    const email = this.jwtService.verify(token) as string
    return new HttpResult(await this.accountService.findAttention(email) , "获取成功")
  }

}