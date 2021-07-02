import { Tasktype } from "../entities/tasktype.entity"

export interface TasktypesResponseInterface {
    tasktypes: Tasktype[],
    tasktypesCount: number
}