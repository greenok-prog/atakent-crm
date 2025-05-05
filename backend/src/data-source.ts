import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Employee } from './employees/entities/employee.entity';
import { Exhibition } from './exhibitions/entities/exhibition.entity';
import { Exhibitor } from './exhibitors/entities/exhibitor.entity';
import { Organizer } from './organizers/entities/organizer.entity';
import { Source } from './sources/entities/source.entity';
import { User } from './users/entities/user.entity';
import { Visitor } from './visitors/entities/visitor.entity';
import { Ticket } from './tickets/entities/ticket.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Exhibitor, Exhibition, Employee, Visitor, User, Source, Organizer, Ticket],
    synchronize: false,    
    migrations: [__dirname + '/migrations/*.{ts,js}'],
});