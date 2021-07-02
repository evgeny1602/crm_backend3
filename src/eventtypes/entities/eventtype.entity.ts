import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "src/events/entities/event.entity";

@Entity({ name: 'eventtypes' })
export class Eventtype {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Event, event => event.eventtype)
    events: Event[];

}
