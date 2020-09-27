import { Auth } from '../schema/Auth';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { google } from 'googleapis';
import Axios from 'axios';
require('dotenv/config');

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  async findUser(token: string): Promise<Auth> {
    return this.authModel.findOne({ token: token });
  }

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

  async saveUser(redirect: string, code: string): Promise<Auth> {
    const auth = await this.connection(redirect);

    const data = await auth.getToken(code);
    const token = data.tokens.id_token;

    const user = await Axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
    );

    const newUser = new this.authModel({
      name: user.data.name,
      email: user.data.email,
      picture: user.data.picture,
      token,
    });
    return newUser.save();
  }

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
