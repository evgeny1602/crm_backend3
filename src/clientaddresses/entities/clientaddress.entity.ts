import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "src/clients/entities/client.entity";


@Entity({ name: 'clientaddresses' })
export class Clientaddress {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    city: string;

    @Column({ nullable: false })
    index: string;

    @Column({ nullable: false })
    country: string;

    @Column({ nullable: false })
    region: string;

    @Column({ nullable: false, default: true })
    is_default: string;

    @ManyToOne(() => Client, client => client.addresses, { onDelete: 'SET NULL' })
    client: Client;

}
