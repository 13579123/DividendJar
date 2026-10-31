import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity("account")
export class Account {

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    name: 'email',
    nullable: false,
    comment: '邮箱',
    primary: true
  })
  email: string = ""

  @Column({
    type: 'varchar',
    length: 50,
    name: 'nickname',
    nullable: false,
    comment: '昵称',
  })
  nickname: string = ""

  @Column({
    type: "int",
    nullable: false,
    default: 0,
    comment: "权限 0 普通用户 1会员 9管理员"
  })
  auth: number = 0

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