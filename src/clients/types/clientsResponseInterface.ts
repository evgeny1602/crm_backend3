import { Client } from "src/clients/entities/client.entity";

export interface ClientsResponseInterface {
    clients: Client[],
    clientsCount: number
}