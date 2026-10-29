import { Module } from '@nestjs/common';
import { AccountController } from './account.controller.js';
import { AccountService } from './account.service.js';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {

}
