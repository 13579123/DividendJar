import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attention } from "../table/Attention.js";
import { Holdings } from "../table/Holdings.js";
import { Slip } from "../table/Slip.js";

@Injectable()
export class SlipService {
  constructor(
    @InjectRepository(Slip)
    private readonly slipRepository: Repository<Slip>
  ) { }

}