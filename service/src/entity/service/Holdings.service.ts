import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attention } from "../table/Attention.js";
import { Holdings } from "../table/Holdings.js";

@Injectable()
export class HoldingsService {
  constructor(
    @InjectRepository(Holdings)
    private readonly holdingsRepository: Repository<Holdings>
  ) { }

  async findAllHoldings(email: string) {
    return this.holdingsRepository.find({ where: { email } })
  }

}