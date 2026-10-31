import { HttpException, HttpStatus } from "@nestjs/common";

// 获取随机字符串
export function generateRandomString(len: number) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

// 判断是否是对象
export const isObject = (obj: any) => {
  return Object.is(toString.call(obj), '[object Object]');
};

// 网络请求返回
export class HttpResult<T> {
  message: string
  response: T
  statusCode: number
  success: boolean
  constructor(r: T, msg?: string, code?: number, success: boolean = true) {
    this.response = r
    this.message = msg || "成功 "
    this.statusCode = code || HttpStatus.OK
    this.success = success
  }
}