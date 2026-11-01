import { ApiProperty } from "@nestjs/swagger"

export class ChangeNicknameDto {

  @ApiProperty({
    description: '昵称',
    default: "小江不会啊"
  })
  nickname: string

}