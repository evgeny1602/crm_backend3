import { Event } from "../entities/event.entity";

export interface EventsResponseInterface {
    events: Event[],
    eventsCount: number
}