import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { Account } from "../../entity/Account.js";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AccountService {

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>
  ) { }

  async findAccount(email: string) {
    return this.accountRepository.findOne({
      where: {email , status: 1},
    })
  }

  async createAccount(email: string) {
    const account = this.accountRepository.create({email})
    return this.accountRepository.save(account)
  }

  async findAttention(email: string) {
    return this.accountRepository.find({
      where: {email , status: 1},
    })
  }

}