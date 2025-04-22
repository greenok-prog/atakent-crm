import type { Exhibition } from "./exhibition";

export interface Visitor {
    id:           number;
    name:         string;
    phone:        string;
    email:        string;
    fair:         string;
    date:         Date;
    executor:     string;
    country:      string;
    companyName:  string;
    qrValue:      string;
    qr:           boolean;
    exhibitionId: number;
    exhibition:    Exhibition;
}
export interface VisitorCreate{
    name:         string;
    phone:        string;
    email:        string;
    fair:         string;
    executor:     string;
    country:      string;
    companyName:  string;
    exhibitionId: number;
    exhibition:    number;
}
export interface Source{
    id:number,
    name:string
}
export interface VisitorStatisticsField{
    name:String,
    count:String
}

export interface VisitorWithStatistics{
    visitors:Visitor[],
    fairStatistics: VisitorStatisticsField[],
    exhibitionStatistics: VisitorStatisticsField[]
    qrStats:number,
    individualCount: number,
    companyCount:number
}