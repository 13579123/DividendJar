import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "../table/Account.js";
import { Repository } from "typeorm";
import { Target } from "../table/Target.js";

@Injectable()
export class TargetService {
  constructor(
    @InjectRepository(Target)
    private readonly targetRepository: Repository<Target>
  ) { }


}