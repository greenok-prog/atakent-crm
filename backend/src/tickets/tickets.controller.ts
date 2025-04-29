import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/exhibition_tickets',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@UploadedFile() file, @Body() body) {
    const { 
      name, 
      x, y, width, height, // Абсолютные значения (пиксели)
      xPercent, yPercent, wPercent, hPercent, // Процентные значения
      id 
    } = body;
    
    return this.ticketsService.create({
      id: id ? parseInt(id) : undefined,
      name,
      image: file.path,
      imageUrl: `/public/${file.path.replace(/^public\\/, '').replace(/\\/g, '/')}`,
      // Сохраняем как абсолютные, так и процентные значения
      x: parseFloat(x),
      y: parseFloat(y),
      w: parseFloat(width),
      h: parseFloat(height),
      xPercent: parseFloat(xPercent),
      yPercent: parseFloat(yPercent),
      wPercent: parseFloat(wPercent),
      hPercent: parseFloat(hPercent),
    });
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
