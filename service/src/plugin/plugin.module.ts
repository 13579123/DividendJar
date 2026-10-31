import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis/redis.service.js';
import { JWTService } from './jwt/jwt.service.js';
import { Biyi_ApiService } from './biyi_api/biyi_api.service.js';

@Global()
@Module({
  providers: [RedisService , JWTService, Biyi_ApiService],
  exports: [RedisService , JWTService, Biyi_ApiService],
  imports: [],
})
export class PluginModule {}