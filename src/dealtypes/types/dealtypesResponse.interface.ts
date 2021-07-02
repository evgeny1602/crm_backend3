import { Dealtype } from "../entities/dealtype.entity"

export interface DealtypesResponseInterface {
    dealtypes: Dealtype[],
    dealtypesCount: number
}