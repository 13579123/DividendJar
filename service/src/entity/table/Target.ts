import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 每年分红目标
@Entity("target")
export class Target {

  @PrimaryGeneratedColumn({})
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
    type: "float",
    nullable: false,
    comment: '每月开销',
  })
  money: number = 0

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '开销名称比如房租，水电',
  })
  name: string = "0"

  @Column({
    type: 'int',
    nullable: false,
    comment: '开销图标索引',
  })
  icon: number = 0
  
  @CreateDateColumn({ 
    name: 'create_time' 
  })
  createTime: Date = new Date

  @UpdateDateColumn({ 
    name: 'update_time' 
  })
  updateTime: Date = new Date
  
}