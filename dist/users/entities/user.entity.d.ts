export declare class User {
    id: number;
    login: string;
    password: string;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    is_active: boolean;
    image: string;
    hashPassword(): Promise<void>;
}
