import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ApiModule } from './api/api.module.js';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThirdModule } from './api/third/third.module.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { PluginModule } from './plugin/plugin.module.js';
import { Account } from './entity/Account.js';

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
          synchronize: false,
          migrationsRun: config.get("DB_SYNC") === "true",
          // 设置日志等级
          logging: ['error'],
          // 注入的实体
          entities: [
            Account,
          ],
        } as TypeOrmModuleOptions
      }
    }),
    PluginModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
