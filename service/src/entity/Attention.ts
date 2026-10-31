import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

// 关注列表
@Entity("attention")
export class Attention {

  @Column({
    type: 'varchar',
    length: 50,
    name: 'email',
    nullable: false,
    comment: '邮箱',
  })
  email: string = ""

  @Column({
    type: 'varchar',
    length: 50,
    name: 'stock_code',
    nullable: false,
    comment: '股票代码',
  })
  stockCode: string = "SZ.00001"

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '0',
    comment: '状态0是正常,1是禁用',
  })
  status: number = 0

  @CreateDateColumn({
    name: 'create_time'
  })
  createTime: Date = new Date

  @UpdateDateColumn({
    name: 'update_time'
  })
  updateTime: Date = new Date

}