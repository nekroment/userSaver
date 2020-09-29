import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/auth/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Запрос на сохраненных карточек user у определенного пользователя
  @Get(':id')
  async findUsers(@Param() params) {
    try {
      return await this.userService.findSavedUsers(params.id);
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

  //Запрос на удаление сохраненной карточки user у определенного пользователя
  @Delete(':id/:authId')
  async deleteUser(@Param() params: UserDTO) {
    try {
      return await this.userService.deleteUser(params.id, params.authId);
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

  //Запрос на сохранение сохраненной карточки user у определенного пользователя
  @Post()
  async saveUser(@Body() body: UserDTO) {
    try {
      return await this.userService.saveUser(body.user, body.authId);
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
}
