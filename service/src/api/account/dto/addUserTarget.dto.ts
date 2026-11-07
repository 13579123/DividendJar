import { ApiProperty } from "@nestjs/swagger"

export class AddUserTargetDto {

  @ApiProperty({
    description: '名称',
    default: "你好"
  })
  name: string

  @ApiProperty({
    description: '开支',
    default: 0
  })
  money: number

  @ApiProperty({
    description: '图标',
    default: 0
  })
  icon: number

}