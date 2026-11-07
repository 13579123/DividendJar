import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "../table/Account.js";
import { Repository } from "typeorm";
import { Target } from "../table/Target.js";
import { ReturnDocument } from "typeorm/driver/mongodb/typings.js";

@Injectable()
export class TargetService {
  constructor(
    @InjectRepository(Target)
    private readonly targetRepository: Repository<Target>
  ) { }

  async findTarget(email: string): Promise<Target[]> {
    return this.targetRepository.find({where: {email}})
  }

  async deleteTarget(id: number) {
    return this.targetRepository.delete(id)
  }

  async changeTarget(t: Target) {
    return this.targetRepository.update(t.id , t)
  }

  async addUserTarget(email: string , name: string , money: number , icon: number) {
    const target = this.targetRepository.create()
    target.email = email
    target.name = name
    target.money = money
    target.icon = icon
    return this.targetRepository.save(target)
  }

}