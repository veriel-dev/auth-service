import { Controller, Logger, Post } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('seeds')
export class SeedsController {
  private readonly logger = new Logger(SeedsController.name);
  constructor(private readonly seedsService: SeedsService) {}
  @Post()
  @ApiOperation({ summary: 'Poblar base de datos con datos de prueba' })
  async seedDatabase() {
    this.logger.log('Iniciando seed de base de datos');
    return await this.seedsService.seedDatabase();
  }
}
