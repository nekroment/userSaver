import { Auth } from '../schema/Auth';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { google } from 'googleapis';
import Axios from 'axios';
const { OAuth2Client } = require('google-auth-library');
require('dotenv/config');

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  //Найти уже некогда авторизировавшегося пользователя
  async findUser(_id: string): Promise<Auth> {
    return this.authModel.findOne({ _id: _id });
  }

  //Подключение к проекту Google
  async connection(redirect: string) {
    const googleConfig = {
      clientId: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      redirect,
    };

    return await new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect,
    );
  }

  //Сохранение пользователя в базе данных и отправка его данных на Front
  async saveUser(redirect: string, code: string): Promise<Auth | string> {
    const auth = await this.connection(redirect);

    const data = await auth.getToken(code);
    const token = data.tokens.id_token;

    //Проверка токена на ликвидность
    const client = new OAuth2Client(process.env.CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
    }
    try {
      verify();
    } catch (error) {
      throw error;
    }

    //Запрос данных пользователя
    const user = await Axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
    );

    const userExists = await this.authModel.findOne({email: user.data.email});
    if(userExists) {
        return userExists;
    }

    const newUser = new this.authModel({
      name: user.data.name,
      email: user.data.email,
      img: user.data.picture,
    });
    return newUser.save();
  }

  //Получение ссылки на авторизацию в Google
  async createConnectionString(redirect: string): Promise<{}> {
    const auth = await this.connection(redirect);

    const defaultScope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'profile',
      'email',
    ];

    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: defaultScope,
    });
  }
}
