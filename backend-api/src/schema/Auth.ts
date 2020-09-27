import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Auth extends Document {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    img: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

