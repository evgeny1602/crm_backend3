import { Clientgroup } from "../entities/clientgroup.entity"

export interface ClientgroupsResponseInterface {
    clientgroups: Clientgroup[],
    clientgroupsCount: number
}