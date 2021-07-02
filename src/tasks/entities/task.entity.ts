import { Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tasktype } from "src/tasktypes/entities/tasktype.entity";
import { User } from "src/users/entities/user.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { Client } from "src/clients/entities/client.entity";
import { Event } from "src/events/entities/event.entity"

@Entity({ name: 'tasks' })
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    start_datetime: Date;

    @Column({ nullable: true })
    end_datetime?: Date;

    @Column({ nullable: true })
    done_datetime?: Date;



    @ManyToOne(() => Tasktype, tasktype => tasktype.tasks, { onDelete: 'SET NULL' })
    tasktype: Tasktype;

    @ManyToMany(() => User, user => user.tasks_worker)
    workerUsers: User[];

    @ManyToOne(() => User, user => user.tasks_master, { onDelete: 'SET NULL' })
    masterUser: User;

    @ManyToOne(() => User, user => user.tasks_creator, { onDelete: 'SET NULL' })
    createUser: User;

    @OneToOne(() => Event, event => event.task, { onDelete: 'SET NULL' })
    event?: Event;

    @ManyToOne(() => Deal, deal => deal.tasks)
    deal?: Deal;

    @ManyToOne(() => Client, client => client.tasks)
    client?: Client;

}
