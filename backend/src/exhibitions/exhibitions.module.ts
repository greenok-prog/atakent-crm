import { Module } from '@nestjs/common';
import { ExhibitionsService } from './exhibitions.service';
import { ExhibitionsController } from './exhibitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { Organizer } from 'src/organizers/entities/organizer.entity';
import { JwtModule } from '@nestjs/jwt';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibition, Organizer, Ticket]),JwtModule.register({
    secret: process.env.SECRET_ACCESS,
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [ExhibitionsController],
  providers: [ExhibitionsService],
})
export class ExhibitionsModule {}
