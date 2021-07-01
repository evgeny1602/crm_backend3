import { Usergroup } from "../entities/usergroup.entity"

export interface UsergroupsResponseInterface {
    usergroups: Usergroup[],
    usergroupsCount: number
}