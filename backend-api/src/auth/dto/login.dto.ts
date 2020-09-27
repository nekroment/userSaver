import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDTO {

    @IsString()
    redirect: string;

    @IsString()
    code: string;

    @IsString()
    _id: string;


}

export class ConnectDTO {

    @IsNotEmpty()
    @IsString()
    redirect: string;
}