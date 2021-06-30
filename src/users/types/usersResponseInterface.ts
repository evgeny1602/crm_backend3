import { User } from "../entities/user.entity";

export interface UsersResponseInterface {
    users: (Omit<User, 'hashPassword'> & { token: string })[],
    usersCount: number
}