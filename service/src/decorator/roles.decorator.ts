import { Reflector } from '@nestjs/core';

// 0 普通用户 1会员用户 9管理员
export const Roles = Reflector.createDecorator<number>();