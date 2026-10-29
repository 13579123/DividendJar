import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module.js';

@Module({
  imports: [
    AccountModule,
  ],
})
export class ApiModule {}
