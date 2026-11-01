import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../entity/table/Account.js';
import { Attention } from '../../entity/table/Attention.js';
import { StockController } from './stock.controller.js';

@Module({
  imports: [
  ],
  controllers: [StockController],
  providers: []
})
export class StockModule {

}
