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

  //Запрос на получение ссылки на авторизацию в Google
  @Post('connection')
  async connect(@Body() body: ConnectDTO) {
    try {
      const connectionString = await this.authService.createConnectionString(
        body.redirect,
      );
      return connectionString;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Запрос на авторизацию в Google
  @Post('login')
  async login(@Body() body: LoginDTO) {
    if (body._id != '') {
      try {
        const userExists = await this.authService.findUser(body._id);
        if (userExists) {
          return userExists;
        }
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: error
          },
          HttpStatus.BAD_REQUEST
        );
      }
    }
    try {
      const newUser = await this.authService.saveUser(body.redirect, body.code);
      return newUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Wrong token'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
