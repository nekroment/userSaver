import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
require('dotenv/config');

const connectionString = 'mongodb+srv://moonlight:382001@cluster0.zkmbj.mongodb.net/saveUser?retryWrites=true&w=majority'
@Module({
  imports: [MongooseModule.forRoot(connectionString), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}