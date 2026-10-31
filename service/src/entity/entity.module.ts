import { Global, Module } from '@nestjs/common';
import { AccountService } from './service/Account.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './table/Account.js';
import { Attention } from './table/Attention.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Attention,
    ]),
  ],
  providers: [AccountService],
  exports: [AccountService],
})
export class EntityModule {
}