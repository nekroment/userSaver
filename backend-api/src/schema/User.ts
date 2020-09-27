import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    
    @Prop({required: true})
    id: number;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    username: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    adress: [{
        street: string,
        suite: string,
        city: string,
        zipcode: string,
        geo: [{
            lat: string,
            lng: string
        }]
    }];

    @Prop({required: true})
    phone: string;

    @Prop({required: true})
    website: string;

    @Prop({required: true})
    company: [{
        name: string,
        catchPhrase: string,
        bs: string
    }]

    @Prop()
    _id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);