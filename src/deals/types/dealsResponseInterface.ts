import { Deal } from "../entities/deal.entity";

export interface DealsResponseInterface {
    deals: Deal[],
    dealsCount: number
}