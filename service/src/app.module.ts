import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ApiModule } from './api/api.module.js';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThirdModule } from './api/third/third.module.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { PluginModule } from './plugin/plugin.module.js';
import { Account } from './entity/table/Account.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard.js';
import { Attention } from './entity/table/Attention.js';
import { EntityModule } from './entity/entity.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用，无需在每个模块重复导入
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'], // 可传数组
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return { 
          type: "mysql",
          host: config.get("DB_HOST"),
          port: config.get("DB_PORT"),
          username: config.get("DB_USER"),
          password: config.get("DB_PWD"),
          database: config.get("DB_DATABASE"),
          // 同步本地的schema与数据库 -> 初始化的时候使用
          synchronize: config.get("DB_SYNC") === "true",
          dropSchema: config.get("DB_SYNC") === "true",//this option maybe helpful
          // 设置日志等级
          logging: ['error'],
          // 注入的实体
          entities: [
            Account,
            Attention,
          ],
        } as TypeOrmModuleOptions
      }
    }),
    EntityModule,
    PluginModule,
    ApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule {}
