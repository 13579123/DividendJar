import { Controller, Get, Req, Headers, Post, Body } from "@nestjs/common";
import { ThirdService } from "./third.service.js";
import { MailerService } from "@nestjs-modules/mailer";
import { generateRandomString, HttpResult } from "../../util/index.js";
import { RedisService } from "../../plugin/redis/redis.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { getLoginCodeto } from "./dto/getLoginCode.dto.js";

@ApiTags("三方")
@Controller('third')
export class ThirdController {

  constructor(
    private thirdService: ThirdService,
    private redisService: RedisService,
  ) {
  }

  @Post("getLoginCode")
  @ApiOperation({ summary: '获取登录验证码' })
  @ApiResponse({ example: new HttpResult("") })
  async getLoginCode(@Body() body: getLoginCodeto) {
    try {
      const email = body.email
      const code = generateRandomString(5).toLowerCase()
      this.redisService.set(["login" , email] , code , 60 * 5)
      this.thirdService.sendMailer(email , "登录验证码" , "验证码为 " + code + " 验证码5分钟有效，请尽快使用")
      return new HttpResult("" , "获取验证码成功")
    } catch(e) {
    }
  }

}