import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Clientgroup } from "src/clientgroups/entities/clientgroup.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Clientaddress } from "src/clientaddresses/entities/clientaddress.entity";


@Entity({ name: 'clients' })
export class Client {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    email: string;

    @Column({ default: '' })
    first_name: string;

    @Column({ default: '' })
    middle_name: string;

    @Column({ default: '' })
    last_name: string;

    @Column({ default: '' })
    phone: string;

    @Column({ default: '' })
    birthday: Date;

    @ManyToOne(() => Clientgroup, clientgroup => clientgroup.clients, { onDelete: 'SET NULL' })
    clientgroup: Clientgroup;

    @OneToMany(() => Deal, deal => deal.client, { onDelete: 'SET NULL' })
    deals: Deal[];

    @OneToMany(() => Event, event => event.defaultPrevented, { onDelete: 'SET NULL' })
    events: Event[];

    @OneToMany(() => Task, task => task.client, { onDelete: "SET NULL" })
    tasks: Task[];

    @OneToMany(() => Clientaddress, clientaddress => clientaddress.client, { onDelete: 'SET NULL' })
    addresses: Clientaddress[];
}
