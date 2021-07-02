import { Client } from "src/clients/entities/client.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'clientgroups' })
export class Clientgroup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Client, client => client.clientgroup)
    clients: Client[];

}
