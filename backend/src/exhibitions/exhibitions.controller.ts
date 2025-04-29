import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ExhibitionsService } from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Exhibitions')
@Controller('exhibitions')
export class ExhibitionsController {
  constructor(private readonly exhibitionsService: ExhibitionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage:diskStorage({
      destination:'public/exhibitions',
      filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
      },
    })
  }))
  async create(@Body() createExhibitionDto: CreateExhibitionDto, @UploadedFile(
    
  ) image:Express.Multer.File) {
      const exhibition = await this.exhibitionsService.create({...createExhibitionDto, image:image.path});
      return exhibition
  }

  @Get()
  async findAll(@Query() query) {
    return await this.exhibitionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionsService.findOne(+id);
  }
  
  @Get(':id/archive')
  async changeArchiveValue( @Param('id') id: number){
    const exhibition = await this.exhibitionsService.findOne(id)
    if(exhibition.archive){
      return await this.exhibitionsService.removeFromArchive(id)
    }else{
      return await this.exhibitionsService.addToArchive(id)
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
  storage: diskStorage({
    destination: 'public/exhibitions',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${uuidv4()}${ext}`;
      cb(null, uniqueName);
    },
  }),
}))
async update(
  @Param('id') id: string,
  @Body() updateExhibitionDto: UpdateExhibitionDto,
  @UploadedFile() file: Express.Multer.File,
) {
  const existing = await this.exhibitionsService.findOne(+id);

  // Если есть новый файл и у выставки уже был старый файл — удалить старый
  if (file && existing.image) {
    const oldImagePath = path.join(process.cwd(), existing.image);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  // Обновить запись, указав путь к новому изображению (если загружено)
  const updatedData = file
    ? { ...updateExhibitionDto, image: file.path.replace(/\\/g, '/') }
    : updateExhibitionDto;

  return this.exhibitionsService.update(+id, updatedData);
}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.exhibitionsService.remove(+id);
  }
}
