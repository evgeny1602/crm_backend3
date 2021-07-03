import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Eventtype } from "src/eventtypes/entities/eventtype.entity";
import { Client } from "src/clients/entities/client.entity";
import { User } from "src/users/entities/user.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { Task } from "src/tasks/entities/task.entity";


@Entity({ name: 'events' })
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    start_datetime: Date;

    @Column({ nullable: true })
    process_datetime: Date;

    @ManyToOne(() => Eventtype, eventtype => eventtype.events, { onDelete: 'SET NULL' })
    eventtype: Eventtype;

    @ManyToOne(() => Client, client => client.events, { onDelete: 'SET NULL' })
    client: Client;

    @OneToOne(() => Task, task => task.event, { onDelete: 'SET NULL' })
    @JoinColumn()
    task: Task;

    @ManyToOne(() => Deal, deal => deal.events, { onDelete: 'SET NULL' })
    deal: Deal;

    @ManyToOne(() => User, user => user.events, { onDelete: 'SET NULL' })
    user: User;

    @ManyToOne(() => User, user => user.events_process, { onDelete: 'SET NULL' })
    processUser: User;

}
