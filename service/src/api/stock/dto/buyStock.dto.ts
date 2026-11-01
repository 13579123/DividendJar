import { ApiProperty } from "@nestjs/swagger"

export class BuyStockDto {

  @ApiProperty({
    description: '股票代码',
    default: "000001.SZ"
  })
  code: string = "000001.SZ"

  @ApiProperty({
    description: '股票价格',
    default: 1
  })
  cost: number = 1

  @ApiProperty({
    description: '股票数量',
    default: 100
  })
  count: number = 100

  @ApiProperty({
    description: "手续费,默认万1",
    default: 0.00001
  })
  charge: number = 0.00001

}