import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/auth/dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async findUsers (@Param() params) {
        return await this.userService.findSavedUsers(params.id);
    }

    @Delete(':id/:authId')
    async deleteUser (@Param() params: UserDTO) {
        return await this.userService.deleteUser(params.id, params.authId);
    }
    @Post()
    async saveUser (@Body() body: UserDTO) {
        return await this.userService.saveUser(body.user, body.authId);
    }

}
