import { Module } from '@nestjs/common';
import { ThirdController } from './third.controller.js';
import { ThirdService } from './third.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: config.get("MAILER_HOST"),
            port: config.get("MAILER_POST"),
            auth: {
              user: config.get("MAILER_EMAIL"),
              pass: config.get("MAILER_PASSWPRD"),
            },
          },
          defaults: {
            from: config.get("MAILER_EMAIL"),
          },
        }
      }
    }),
  ],
  controllers: [ThirdController],
  providers: [ThirdService]
})
export class ThirdModule {

}
