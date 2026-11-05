import { Global, Module } from '@nestjs/common';
import { AccountService } from './service/Account.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './table/Account.js';
import { Attention } from './table/Attention.js';
import { AttentionService } from './service/Attention.service.js';
import { Holdings } from './table/Holdings.js';
import { Slip } from './table/Slip.js';
import { HoldingsService } from './service/Holdings.service.js';
import { SlipService } from './service/Slip.service.js';
import { Target } from './table/Target.js';
import { TargetService } from './service/Target.service.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Attention,
      Holdings,
      Slip,
      Target,
    ]),
  ],
  providers: [
    AccountService,
    AttentionService,
    HoldingsService,
    SlipService,
    TargetService,
  ],
  exports: [
    AccountService,
    AttentionService,
    HoldingsService,
    SlipService,
    TargetService,
  ],
})
export class EntityModule {
}