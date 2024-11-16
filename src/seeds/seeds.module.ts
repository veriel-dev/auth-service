import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SeedsController],
  providers: [SeedsService],
})
export class SeedsModule {}
