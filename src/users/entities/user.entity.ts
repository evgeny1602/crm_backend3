import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column({ select: false })
    password: string;

    @Column()
    email: string;

    @Column({ default: '' })
    first_name: string;

    @Column({ default: '' })
    middle_name: string;

    @Column({ default: '' })
    last_name: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: '' })
    image: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
