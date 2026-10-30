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
  email!: string;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '0',
    comment: '状态0是正常,1是禁用',
  })
  status!: number;

  
  @CreateDateColumn({ 
    name: 'create_time' 
  })
  createTime: Date;

  @UpdateDateColumn({ 
    name: 'update_time' 
  })
  updateTime: Date;
  
}