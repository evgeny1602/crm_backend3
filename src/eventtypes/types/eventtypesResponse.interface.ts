import { Eventtype } from "../entities/eventtype.entity"

export interface EventtypesResponseInterface {
    eventtypes: Eventtype[],
    eventtypesCount: number
}