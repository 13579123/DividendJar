import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken"

@Injectable()
export class JWTService {

  constructor(private configService: ConfigService) {}
  
  create(data: string) {
    const key = this.configService.get("JWT_KEY")
    return jwt.sign(data , key)
  }

  verify(token: string) {
    const key = this.configService.get("JWT_KEY")
    return jwt.verify(token , key)
  }

}