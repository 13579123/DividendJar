import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ThirdService {

  constructor(private mailerService: MailerService) {}

  // 发送验证码
  public async sendMailer(email: string , title: string , content: string) {
    this.mailerService.send({
      to: email,
      subject: title,
      text: content
    })
  }
    
}