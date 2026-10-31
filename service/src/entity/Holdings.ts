import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 持仓列表
@Entity("holdings")
export class Holdings {

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
    comment: '持仓代码',
  })
  code: number = 0

  @Column({
    type: "float",
    nullable: false,
    comment: '持仓成本',
  })
  coast: number = 0

  @Column({
    type: "int",
    nullable: false,
    comment: '持仓数量',
  })
  count: number = 0
  
  @CreateDateColumn({ 
    name: 'create_time' 
  })
  createTime: Date = new Date

  @UpdateDateColumn({ 
    name: 'update_time' 
  })
  updateTime: Date = new Date
  
}