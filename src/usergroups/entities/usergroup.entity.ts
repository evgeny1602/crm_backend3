import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usergroups' })
export class Usergroup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

}
