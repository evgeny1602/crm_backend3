import { Deal } from "src/deals/entities/deal.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'dealtypes' })
export class Dealtype {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Deal, deal => deal.dealtype)
    deals: Deal[];

}
