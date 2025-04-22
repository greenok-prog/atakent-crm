import type { Organizer } from "./organizer"

export interface Exhibition{
    name:string, 
    description:string,
    dateStart:Date,
    dateEnd:Date,
    image?: string,
    location:string
    id:number
    organizer:Organizer,
    organizer_id:number,
    website?:string
}


export interface ExhibitionCreate{
    name:string, 
    description:string,
    dateStart:Date,
    dateEnd:Date,
    image?: File,
    location:string
    organizer_id:number
}
