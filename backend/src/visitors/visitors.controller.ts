import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Header, StreamableFile, UseGuards } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { Response } from 'express';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Visitors')
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto);
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query) {
    return this.visitorsService.findAll(query);
  }



  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateVisitorDto: UpdateVisitorDto) {
    return this.visitorsService.update(+id, updateVisitorDto);
  }
  @Get(':id/ticket/pdf')
  async downloadTicket(@Param('id') id: number, @Res() res: Response) {
    const buffer = await this.visitorsService.generatePdfTicket(+id);
  
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ticket-${id}.pdf"`,
      'Content-Length': buffer.length
    });
  
    res.end(buffer);
  }
  @Get('export')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="visitors.xlsx"')
  async exportVisitors(@Query() query): Promise<StreamableFile> {
    return this.visitorsService.exportToExcel(query);
  }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.visitorsService.remove(+id);
  }
  @Get('verify-uuid')
  async verifyUuid(@Query('uuid') uuid: string) {
    const visitor = await this.visitorsService.findByQrUuid(uuid);
      
    if (!visitor) {
      return { valid: false, message: 'QR code not found' };
    }
    
    return {
      valid: true,
      visitor,
      scanned: visitor.qr // qr field indicates if it's already scanned
    };
    
  }

  @Post('scan-uuid')
  async scanUuid(@Body() body: { uuid: string }) {

    
    try {
      const success = await this.visitorsService.changeQrValue(body.uuid);
      
      if (!success) {
        return { success: false, message: 'QR code not found' };
      }
      
      const visitor = await this.visitorsService.findByQrUuid(body.uuid);
      
      return {
        success: true,
        message: 'Visitor marked as scanned',
        visitor
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get("change")
  async changeQr(@Query('uuid') uuid: string, @Res() res: Response) {
    
    try {
      const success = await this.visitorsService.changeQrValue(uuid)

      if (success) {
        return res.redirect("/scan-success")
      } else {
        return res.redirect("/scan-error")
      }
    } catch (error) {
      return res.redirect("/scan-error")
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.visitorsService.findOne(+id);
    

  }
}

