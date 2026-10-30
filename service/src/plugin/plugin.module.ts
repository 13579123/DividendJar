import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis/redis.service.js';
import { JWTService } from './jwt/jwt.service.js';

@Global()
@Module({
  providers: [RedisService , JWTService],
  exports: [RedisService , JWTService],
  imports: [],
})
export class PluginModule {}