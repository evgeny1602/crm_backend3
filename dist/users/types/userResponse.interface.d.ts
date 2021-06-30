import { User } from "../entities/user.entity";
export interface UserResponseInterface {
    user: Omit<User, 'hashPassword'> & {
        token: string;
    };
}
