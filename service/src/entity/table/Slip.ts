import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SlipType {
  BUY = 0,
  SELL = 1
}

// 交易记录
@Entity("Slip")
export class Slip {

  @PrimaryGeneratedColumn()
  id: number = 0

  @Index()
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
    nullable: false,
    comment: '买卖代码',
  })
  code: string = ""

  @Column({
    type: "float",
    nullable: false,
    comment: '买卖成本',
  })
  coast: number = 0

  @Column({
    type: "int",
    nullable: false,
    comment: '买卖数量数量',
  })
  count: number = 0

  @Column({
    type: "float",
    nullable: false,
    default: 0.00001,
    comment: '手续费 , 除以10000，最低5',
  })
  charge: number = 0.00001

  @Column({
    type: "int",
    nullable: false,
    default: 0,
    comment: '买卖类型，0买1卖',
  })
  type: SlipType = SlipType.BUY
  
  @CreateDateColumn({ 
    name: 'create_time' 
  })
  createTime: Date = new Date

  @UpdateDateColumn({ 
    name: 'update_time' 
  })
  updateTime: Date = new Date
  
}