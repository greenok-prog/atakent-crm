import type { Exhibition } from "./exhibition";

export interface Exhibitor {
    id:           number;
    companyName:  string;
    companyPhone: string;
    exhibiton:    Exhibition;
    exhibitionId: number;
    website:      string;
    email:        string;
    employees:    Employee[];
    logo:         string;
    instagram:    string;
    youtube:      string;
    facebook:     string;
}

export interface Employee {
    id:          number;
    name:        string;
    position:    string;
    exhibitorId: number;
}