import { ApiProperty } from "@nestjs/swagger"

export class LoginVo {

  @ApiProperty({
    description: '登录信息凭证',
    default: "afssa51fgas5g1a2d3g1as"
  })
  public token: string

  constructor(token: string) {
    this.token = token
  }

}