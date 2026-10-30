import { Injectable } from '@nestjs/common';
import { ClientContext, Result, Redis } from 'ioredis';
import { isObject } from '../../util/index.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {

  constructor(private configService: ConfigService) {}

  public redisClient!: Redis;

  // 模块加载的时候就缓存创建redis句柄
  onModuleInit() {
    if (!this.redisClient) {
      this.getClient();
    }
  }

  private getClient() {
    this.redisClient = new Redis({
      port: parseInt(this.configService.get("REDIS_PORT") as string), // Redis port
      host: this.configService.get("REDIS_HOST"), // redisDb Redis host
      username: this.configService.get("REDIS_USERNAME"), // needs Redis >= 6
      password: this.configService.get("REDIS_PASSWORD"), // 密码
      db: this.configService.get("REDIS_DB") // redis是几个数据库的，使用第一个
    });
  }

  /**
   * @Description: 设置值到redis中
   * @param {any} value
   * @param {number} second 过期时间秒
   * @return {*}
   */
  public async  set(key: string | string[], value: unknown): Promise<Result<'OK', ClientContext>>;
  public async set(
    key: string | string[],
    value: unknown,
    second: number
  ): Promise<Result<'OK', ClientContext>>;
  public async set(key: string | string[] , value: any, second?: number): Promise<Result<'OK', ClientContext>> {
    if (Array.isArray(key)) key = key.join(":")
    value = isObject(value) ? JSON.stringify(value) : value;
    if (!second) {
      return await this.redisClient.set(key, value);
    } else {
      return await this.redisClient.set(key, value, 'EX', second);
    }
  }

  /**
   * @Description: 设置自动 +1
   * @param {string} key
   * @return {*}
   */
  public async incr(key: string | string[]): Promise<Result<number, ClientContext>> {
    if (Array.isArray(key)) key = key.join(":")
    return await this.redisClient.incr(key);
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  public async get(key: string | string[]): Promise<Result<string | null, ClientContext>> {
    if (Array.isArray(key)) key = key.join(":")
    try {
      const data = await this.redisClient.get(key);
      if (data) {
        return JSON.parse(data);
      } else {
        return null;
      }
    } catch (e) {
      return await this.redisClient.get(key);
    }
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param {string} key
   * @return {*}
   */
  public async del(key: string| string[]): Promise<Result<number, ClientContext>> {
    if (Array.isArray(key)) key = key.join(":")
    return await this.redisClient.del(key);
  }

  async hset(key: string, field: string): Promise<Result<number, ClientContext>> {
    return await this.redisClient.hset(key, field);
  }

  /**
   * @Description: 获取单一个值
   * @param {string} key
   * @param {string} field
   * @return {*}
   */
  async hget(key: string, field: string): Promise<Result<string | null, ClientContext>> {
    return await this.redisClient.hget(key, field);
  }

  /**
   * @Description: 获取全部的hget的
   * @param {string} key
   * @return {*}
   */
  async hgetall(key: string): Promise<Result<Record<string, string>, ClientContext>> {
    return await this.redisClient.hgetall(key);
  }

  /**
   * @Description: 清空redis的缓存
   * @return {*}
   */
  public async flushall(): Promise<Result<'OK', ClientContext>> {
    return await this.redisClient.flushall();
  }
}