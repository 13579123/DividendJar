import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module.js';
import { ThirdModule } from './third/third.module.js';

@Module({
  imports: [
    AccountModule,
    ThirdModule,
  ],
})
export class ApiModule {}
