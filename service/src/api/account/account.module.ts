import { Module } from '@nestjs/common';
import { AccountController } from './account.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entity/table/Account.js';
import { Attention } from '../../entity/table/Attention.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Attention,
    ]),
  ],
  controllers: [AccountController],
  providers: []
})
export class AccountModule {

}
