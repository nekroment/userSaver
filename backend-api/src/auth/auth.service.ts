import { User } from './../schema/User';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { google } from 'googleapis';
require('dotenv/config');

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findUser(token: string): Promise<User> {
        return this.userModel.findOne({token: token});
    }

    async saveUser(name: string, email: string, img: string, token: string): Promise<User> {
        const newUser = new this.userModel({
            name,
            email,
            img,
            token
        });
        return newUser.save();
    }

    async createConnectionString(redirect: string, code: string): Promise<{}> {
        const googleConfig = {
            clientId: `${process.env.CLIENT_ID}`, 
            clientSecret: `${process.env.CLIENT_SECRET}`, 
            redirect 
          };

        const auth = new google.auth.OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirect
        );

        const data = await auth.getToken(code);
        return data.tokens.id_token;


    }
}
