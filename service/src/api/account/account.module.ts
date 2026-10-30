import { Module } from '@nestjs/common';
import { AccountController } from './account.controller.js';
import { AccountService } from './account.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entity/Account.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {

}
