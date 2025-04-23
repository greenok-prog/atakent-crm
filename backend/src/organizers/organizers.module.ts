import { Module } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './entities/organizer.entity';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer, Exhibition]),JwtModule.register({
    secret: process.env.SECRET_ACCESS,
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [OrganizersController],
  providers: [OrganizersService],
})
export class OrganizersModule {}
