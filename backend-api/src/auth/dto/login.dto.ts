import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDTO {

    @IsString()
    redirect: string;

    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}

export class ConnectDTO {

    @IsNotEmpty()
    @IsString()
    redirect: string;
}