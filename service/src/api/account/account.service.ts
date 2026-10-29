import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AccountService {

    async createAccount() {
        return "creat account"
    }

}