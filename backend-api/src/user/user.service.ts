import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User } from 'src/schema/User';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findSavedUsers(id: string) {
        return await this.userModel.find({authId: id});
    }

    async saveUser(user: User, authId: string) {
        const newUser = user;
        newUser.authId = authId;
        const createUser = new this.userModel(newUser);
        return await createUser.save();
    }

    async deleteUser(id: number | string, authId: string) {
        return await this.userModel.remove({id: id, authId: authId})
    }
}
