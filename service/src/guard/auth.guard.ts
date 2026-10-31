import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWTService } from '../plugin/jwt/jwt.service.js';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entity/table/Account.js';
import { Repository } from 'typeorm';
import { AccountService } from '../entity/service/Account.service.js';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly JwtService: JWTService,
    private reflector: Reflector,
    private accountService: AccountService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const canActiveRoles = this.reflector.get(Roles , context.getHandler())
    if (canActiveRoles === undefined) return true
    const token =
      context.switchToRpc().getData().headers.token ||
      context.switchToHttp().getRequest().headers?.token ||
      context.switchToHttp().getRequest().body.token;
    if (!token) throw new HttpException("没有登录信息" , HttpStatus.OK)
    try {
      const email = this.JwtService.verify(token) as string
      const account = await this.accountService.findAccount(email)
      console.log(account)
      if (!account) throw "登录信息无效"
      if (canActiveRoles && canActiveRoles > account.auth) throw new HttpException("权限不够" , HttpStatus.OK)
      return true
    } catch(e) {
      console.log(e)
      throw new HttpException("登录信息失效" , HttpStatus.OK)
    }
  }
}