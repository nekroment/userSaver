import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, ConnectDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('connection')
  async connect(@Body() body: ConnectDTO) {
    const connectionString = await this.authService.createConnectionString(
      body.redirect,
    );
    return connectionString;
  }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    if (body._id != '') {
      const userExists = await this.authService.findUser(body._id);
      if (userExists) {
        return userExists;
      }
    }
    try {
      const newUser = await this.authService.saveUser(body.redirect, body.code);
      return newUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Wrong token',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
