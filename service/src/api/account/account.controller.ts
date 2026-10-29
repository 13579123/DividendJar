import { Controller, Get, Req, Headers } from "@nestjs/common";
import { AccountService } from "./account.service.js";
import { ConfigService } from "@nestjs/config";

@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService) {
    }

    @Get("accountData")
    async findAll(@Headers("token") token: string): Promise<string> {
        return this.accountService.createAccount()
    }

}