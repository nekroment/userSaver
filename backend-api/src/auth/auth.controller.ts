import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, ConnectDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('connection')
    async connect (@Body() body: ConnectDTO) {
        const connectionString = await this.authService.createConnectionString(body.redirect);
        return connectionString;
    }

    @Post('login')
    async login (@Body() body: LoginDTO) {

        const userToken = body.token;

        if(userToken) {
            const userExists = await this.authService.findUser(userToken);
            if(userExists) {
            return userExists;
        }
        }
        
        const newUser = await this.authService.saveUser(body.redirect, body.code);

        return newUser;


        


    }

}
