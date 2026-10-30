import { Controller, Get, Req, Headers, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { AccountService } from "./account.service.js";
import { RedisService } from "../../plugin/redis/redis.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginVo } from "./vo/login.vo.js";
import { HttpResult } from "../../util/index.js";
import { JWTService } from "../../plugin/jwt/jwt.service.js";

@ApiTags("用户")
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
  @ApiOperation({ summary: '根据token获取用户信息' })
  async accountData(@Headers("token") token: string) {
    return this.accountService.createAccount("")
  }

}