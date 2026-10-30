import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {

  @ApiProperty({
    description: '邮箱',
    default: "123456789@qq.com"
  })
  email: string

  @ApiProperty({
    description: '验证码',
    default: "123456"
  })
  code: string

}