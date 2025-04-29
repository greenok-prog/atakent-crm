import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExhibitorsModule } from './exhibitors/exhibitors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibitor } from './exhibitors/entities/exhibitor.entity';
import { ExhibitionsModule } from './exhibitions/exhibitions.module';
import { Exhibition } from './exhibitions/entities/exhibition.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities/employee.entity';
import { VisitorsModule } from './visitors/visitors.module';
import { Visitor } from './visitors/entities/visitor.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SourcesModule } from './sources/sources.module';
import { Source } from './sources/entities/source.entity';
import { OrganizersModule } from './organizers/organizers.module';
import { Organizer } from './organizers/entities/organizer.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from './mailer/mailer.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitorsModule, ExhibitionsModule, EmployeesModule, VisitorsModule, UsersModule, AuthModule, OrganizersModule, SourcesModule, JwtModule, MailerModule]),
  ScheduleModule.forRoot(),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // делает конфигурацию доступной глобально// путь к вашему .env файлу
  }),
  
  TypeOrmModule.forRoot({
    
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Exhibitor, Exhibition, Employee, Visitor, User, Source, Organizer],
    synchronize: true,        // 👈 Это создаёт таблицы автоматически
    autoLoadEntities: true,
    
    
  }), 
  
  ExhibitionsModule, ExhibitorsModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),  // Путь до public папки
    serveRoot: '/public',  // Путь, по которому будут доступны статичные файлы
  }),
  
  EmployeesModule,
  VisitorsModule,
  UsersModule,
  AuthModule,
  JwtModule,
  SourcesModule,
  OrganizersModule,
  MailerModule,
  TicketsModule],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard, JwtService],
  
})
export class AppModule {}
