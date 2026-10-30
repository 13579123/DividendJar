import { ApiProperty } from "@nestjs/swagger"

export class getLoginCodeto {

  @ApiProperty({
    description: '邮箱',
    default: "123456789@qq.com"
  })
  email: string

}