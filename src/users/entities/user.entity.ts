import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';
import { Usergroup } from "src/usergroups/entities/usergroup.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    login: string;

    @Column({ select: false })
    password: string;

    @Column({ unique: true })
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

    @ManyToOne(() => Usergroup, usergroup => usergroup.users, { onDelete: 'SET NULL', eager: true })
    usergroup: Usergroup;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
