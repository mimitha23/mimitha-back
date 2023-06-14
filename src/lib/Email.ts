import pug from "pug";
import nodemailer, {
  Transporter,
  TransportOptions,
  SendMailOptions,
} from "nodemailer";
import {
  NODE_MODE,
  SERVER_ORIGIN,
  APP_ORIGIN,
  EMAIL_USER,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_PASSWORD,
  EMAIL_SERVICE,
} from "../config/env";
import { AppName } from "../config/config";

interface NewEmailT {
  adressat: string;
}

interface SendEmailT {
  text?: string;
  subject?: string;
  templateName?: string;
  templateParams?: any;
}

interface SendWelcomeT {
  userName: string;
}

interface SendPasswordResetT {
  userName: string;
  resetToken: string;
}

class Email {
  user;
  from;
  adressat;

  constructor({ adressat }: NewEmailT) {
    this.user = EMAIL_USER;
    this.from = `${AppName} <${this.user}>`;
    this.adressat = adressat;
  }

  transport(): Transporter {
    const transportOptions: TransportOptions = {
      secure: NODE_MODE === "PROD" ? true : false,
      service: EMAIL_SERVICE,
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: this.user,
        pass: EMAIL_PASSWORD,
      },
    } as any;

    return nodemailer.createTransport(transportOptions);
  }

  async send({
    text,
    subject,
    templateName,
    templateParams = null,
  }: SendEmailT) {
    try {
      const transportConfig: SendMailOptions = {
        from: this.from,
        to: this.adressat,
        subject,
        text,
      };

      if (templateName)
        transportConfig.html = pug.renderFile(
          `${__dirname}/../views/emails/${templateName}.pug`,
          { ...templateParams }
        );

      await this.transport().sendMail(transportConfig);
    } catch (error) {
      throw error;
    }
  }

  async sendWelcome({ userName }: SendWelcomeT) {
    try {
      await this.send({
        text: `Wellcome to ${AppName}`,
        subject: `Welcome To ${AppName}`,
        templateName: "wellcome",
        templateParams: {
          userName: userName,
          host: SERVER_ORIGIN,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async sendPasswordReset({ resetToken, userName }: SendPasswordResetT) {
    try {
      await this.send({
        subject: `${AppName} Password Reset`,
        templateName: "passwordReset",
        templateParams: {
          url: `${APP_ORIGIN}/auth/set-password/${resetToken}`,
          userName,
          host: SERVER_ORIGIN,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default Email;
