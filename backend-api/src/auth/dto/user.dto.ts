import { IsString, IsNotEmpty } from 'class-validator';
import { User } from 'src/schema/User';

export class UserDTO {

    user: User;

    id: string;

    authId: string;
}