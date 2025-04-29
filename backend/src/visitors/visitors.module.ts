import { Module } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtModule } from '@nestjs/jwt';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { TicketsService } from 'src/tickets/tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, Exhibition, Ticket]), MailerModule, JwtModule.register({
    secret: process.env.SECRET_ACCESS,
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [VisitorsController],
  providers: [VisitorsService, MailerService, TicketsService],
})
export class VisitorsModule {}
