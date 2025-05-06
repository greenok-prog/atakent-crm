import type { Exhibition } from "./exhibition";

export interface Ticket{
    id:number,
    name:string,
    image:string,
    exhibitions:Exhibition[]
}
export interface TicketCreate{
    name:string,
    image:File
}