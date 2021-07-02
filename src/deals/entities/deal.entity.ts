import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dealtype } from "src/dealtypes/entities/dealtype.entity";
import { Client } from "src/clients/entities/client.entity";
import { User } from "src/users/entities/user.entity";
import { Event } from "src/events/entities/event.entity";
import { Task } from "src/tasks/entities/task.entity";


@Entity({ name: 'deals' })
export class Deal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    start_datetime: Date;

    @Column({ nullable: true })
    end_datetime: Date;


    @Column({ nullable: true })
    done_datetime: Date;

    @ManyToOne(() => Dealtype, dealtype => dealtype.deals, { onDelete: 'SET NULL' })
    dealtype: Dealtype;

    @ManyToOne(() => Client, client => client.deals, { onDelete: 'SET NULL' })
    client: Client;

    @ManyToOne(() => User, user => user.deals, { onDelete: 'SET NULL' })
    workerUser: User;

    @ManyToOne(() => User, user => user.deals_done, { onDelete: 'SET NULL' })
    doneUser: User;

    @OneToMany(() => Event, event => event.deal)
    events: Event[];

    @OneToMany(() => Task, task => task.deal, { onDelete: 'SET NULL' })
    tasks: Task[];

}
