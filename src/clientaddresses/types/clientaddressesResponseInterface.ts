import { Clientaddress } from "../entities/clientaddress.entity";

export interface ClientaddressesResponseInterface {
    clientaddresses: Clientaddress[],
    clientaddressesCount: number
}