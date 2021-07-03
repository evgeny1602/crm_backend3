import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';
import { Usergroup } from "src/usergroups/entities/usergroup.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { Event } from "src/events/entities/event.entity";

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

    @ManyToMany(() => Task, task => task.worker_users, { onDelete: 'SET NULL' })
    @JoinTable()
    tasks_worker: Task[];

    @OneToMany(() => Task, task => task.master_user, { onDelete: 'SET NULL' })
    tasks_master: Task[];

    @OneToMany(() => Task, task => task.create_user, { onDelete: 'SET NULL' })
    tasks_creator: Task[];

    @OneToMany(() => Deal, deal => deal.workerUser, { onDelete: "SET NULL" })
    deals: Deal[];

    @OneToMany(() => Deal, deal => deal.doneUser, { onDelete: 'SET NULL' })
    deals_done: Deal[];

    @OneToMany(() => Event, event => event.user, { onDelete: 'SET NULL' })
    events: Event[];

    @OneToMany(() => Event, event => event.processUser, { onDelete: 'SET NULL' })
    events_process: Event[];




    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
