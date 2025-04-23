import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Source]), JwtModule.register({
    secret: process.env.SECRET_ACCESS,
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule {}
