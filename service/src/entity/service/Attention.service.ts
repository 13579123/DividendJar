import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "../table/Account.js";
import { Repository } from "typeorm";
import { Attention } from "../table/Attention.js";

@Injectable()
export class AttentionService {
  constructor(
    @InjectRepository(Attention)
    private readonly attentionRepository: Repository<Attention>
  ) { }

  async findAllAttention(email: string) {
    return this.attentionRepository.find({
      where: { email, status: 0 },
    })
  }

}