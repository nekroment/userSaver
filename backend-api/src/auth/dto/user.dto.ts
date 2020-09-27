import { IsString, IsNotEmpty } from 'class-validator';
import { User } from 'src/schema/User';

export class UserDTO {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    user: User;
}