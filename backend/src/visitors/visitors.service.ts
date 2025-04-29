import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, Redirect, Res, StreamableFile } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { Between, Equal, LessThanOrEqual, Repository, getRepository } from 'typeorm';
import * as qr from 'qrcode';
import * as fs from 'fs-extra'
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as path from 'path';
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { getHtmlMessage } from './utils/pdf';
import { MailerService } from '../mailer/mailer.service';
import { PassThrough } from 'stream';
import * as ExcelJS from 'exceljs';
import * as sharp from 'sharp';
import { TicketsService } from 'src/tickets/tickets.service';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Injectable()
export class VisitorsService {
  private readonly logger = new Logger(VisitorsService.name);
  constructor(
    @InjectRepository(Visitor)
    private VisitorRepository: Repository<Visitor>,
    @InjectRepository(Exhibition)
    private ExhibitionRepository: Repository<Exhibition>,
    @InjectRepository(Ticket)
    private TicketRepository: Repository<Ticket>,
    private configService: ConfigService,
    private mailerService: MailerService,
    private ticketService: TicketsService
    

  ){}
  
  async generateQR(uid, data): Promise<any> {
    const uniqId = uid
    const qrData = process.env.BASE_URL + `/visitors/change?uuid=${uniqId}`
    const qrDirectory = this.configService.get<string>('QR_PATH');
    
    const qrCodeBuffer = await qr.toBuffer(qrData, { errorCorrectionLevel: 'H', type:'png', width:540, heigth:540, margin:1 });
    const qrImagePath = `${qrDirectory}/${uniqId}.png`;
    const staticPath = `/public/qr/${uniqId}.png`

    await fs.writeFile(qrImagePath, qrCodeBuffer);

    return {staticPath:staticPath, path:qrImagePath,};
  }
  
  async create(createVisitorDto: CreateVisitorDto) {
    const { email, phone, exhibition } = createVisitorDto;
  
    // Проверка на дубликаты по email или номеру телефона
    const existingVisitor = await this.VisitorRepository.findOne({
      where: [
        { email, exhibitionId: exhibition },
        { phone, exhibitionId: exhibition },
      ],
    });
    if (existingVisitor) {
      const errors: Record<string, string> = {};
    
      if (existingVisitor.email === createVisitorDto.email) {
        errors.email = 'Этот email уже зарегистрирован на выставку';
      }
    
      if (existingVisitor.phone === createVisitorDto.phone) {
        errors.phone = 'Этот номер телефона уже зарегистрирован на выставку';
      }
    
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  
    const uniqId = uuidv4();
    const exhibitionEntity = await this.ExhibitionRepository.findOneBy({ id: exhibition });
    const { staticPath } = await this.generateQR(uniqId, createVisitorDto);
  
    const visitor = this.VisitorRepository.create({
      ...createVisitorDto,
      date: new Date(),
      exhibitionId: exhibition,
      qrValue: staticPath,
      exhibition: exhibitionEntity,
      uuid: uniqId,
    });
  
    const savedVisitor = await this.VisitorRepository.save(visitor);
  
    try {
      const pdfBuffer = await this.generatePdfTicket(savedVisitor.id);
      // await this.mailerService.sendTicket(
      //   savedVisitor.email,
      //   Buffer.from(pdfBuffer),
      //   `ticket-${savedVisitor.name}.pdf`,
      // );
    } catch (err) {
      this.logger.error('Не удалось отправить билет на email:', err.message);
    }
  
    return savedVisitor;
  }
  
  async findAll(query: any) {
    const {
      exhibition,
      fair,
      registrationDateStart,
      registrationDateEnd,
      type,
      page = 1,
      limit = 10,
    } = query;
  
    const skip = (page - 1) * limit;
  
    const where: any = {
      exhibitionId: exhibition,
      fair,
      executor: type,
    };
  
    if (registrationDateStart && registrationDateEnd) {
      where.date = Between(registrationDateStart, registrationDateEnd);
    }
  
    try {
      const [visitorsList, totalCount] = await this.VisitorRepository.findAndCount({
        where,
        relations: ['exhibition'],
        order: { date: 'DESC' },
        take: +limit,
        skip: +skip,
      });
  
      const [exhibitionStatistics, fairStatistics] = await Promise.all([
        this.VisitorRepository.createQueryBuilder('visitor')
          .select('exhibition.name', 'name')
          .addSelect('COUNT(visitor.id)', 'count')
          .innerJoin('visitor.exhibition', 'exhibition')
          .groupBy('exhibition.id')
          .getRawMany(),
  
        this.VisitorRepository.createQueryBuilder('visitor')
          .select('visitor.fair', 'name')
          .addSelect('COUNT(DISTINCT visitor.id)', 'count')
          .groupBy('visitor.fair')
          .getRawMany(),
      ]);
  
      return {
        visitors: visitorsList,
        total: totalCount,
        page: +page,
        limit: +limit,
        pages: Math.ceil(totalCount / limit),
        fairStatistics,
        exhibitionStatistics,
        individualCount: visitorsList.filter(v => v.executor === 'individual').length,
        companyCount: visitorsList.filter(v => v.executor === 'company').length,
        qrStats: visitorsList.filter(v => v.qr).length,
      };
    } catch (error) {
      throw error;
    }
  }
  
  async exportToExcel(query: any): Promise<StreamableFile> {
    const { exhibition, fair, registrationDateStart, registrationDateEnd } = query;
    console.log(query);
    
    const where: any = {};
    if (exhibition) where.exhibitionId = +exhibition;
    if (fair) where.fair = fair;
    if (registrationDateStart && registrationDateEnd) {
      where.date = Between(new Date(registrationDateStart), new Date(registrationDateEnd));
    }
  
    const visitors = await this.VisitorRepository.find({
      where,
      relations: ['exhibition'],
      order: { date: 'DESC' },
    });
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Посетители');
  
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Имя', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Телефон', key: 'phone', width: 20 },
      { header: 'Тип', key: 'executor', width: 15 },
      { header: 'Ярмарка', key: 'fair', width: 15 },
      { header: 'Дата регистрации', key: 'date', width: 20 },
      { header: 'Выставка', key: 'exhibition', width: 25 },
    ];
  
    visitors.forEach(visitor => {
      worksheet.addRow({
        id: visitor.id,
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        executor: visitor.executor,
        fair: visitor.fair,
        date: visitor.date.toLocaleString(),
        exhibition: visitor.exhibition?.name ?? '',
      });
    });
    console.log('Экспортируем:', visitors.length, 'записей');

    const buffer = await workbook.xlsx.writeBuffer();
    const stream = new PassThrough();
    stream.end(buffer);
  
    return new StreamableFile(stream);
  }
  
  async changeQrValue(query){
    console.log(query);
    
    const visitor = await this.VisitorRepository.findOne({ where: { uuid: query } });

  if (visitor) {
    visitor.qr = true; 
    await this.VisitorRepository.save(visitor);
    return true;
  } else {
    return false;
  }
    
  }
  async findByQrUuid(uuid: string): Promise<Visitor | null> {
    const visitor = await this.VisitorRepository.findOneBy({uuid})
    return visitor
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldQrCodes() {
    try {
      const qrDirectory = this.configService.get<string>('QR_PATH');
      const fullPath = path.resolve(process.cwd(), qrDirectory);

      const files = await fs.readdir(fullPath);
      const now = new Date();

      for (const file of files) {
        const filePath = path.join(fullPath, file);

        const stats = await fs.stat(filePath);
        const fileAge = (now.getTime() - stats.mtime.getTime()) / 1000; // Convert to seconds

        if (fileAge > 7 * 24 * 60 * 60 * 1000) { // 1 week
          try {
            await fs.unlink(filePath);
            this.logger.log(`Successfully deleted file: ${file}`);
          } catch (error) {
            this.logger.error(`Error deleting file ${file}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error in removeOldQrCodes: ${error.message}`);
    }
    this.logger.log('Cron job finished: removeOldQrCodes');
  }

  async findOne(id: number) {
    const visitor = await this.VisitorRepository.findOneBy({id})
    
    return visitor
  }
 
  async generatePdfTicket(visitorId:number) {
    try {
      const visitorData = await this.VisitorRepository.findOne({
        where: { id: visitorId },
        relations: ['exhibition'],
      });
  
      if (!visitorData) throw new Error('Visitor not found');
      
      this.logger.log(`Генерация билета для посетителя: ${visitorData.name}, ID: ${visitorData.id}`);
  
      // Путь к QR-коду
      const qrPath = path.resolve(
        process.cwd(),
        visitorData.qrValue.replace(/^\/public/, 'public'),
      );
      
      const exhibition = await this.ExhibitionRepository.findOne({
        where: { id: visitorData.exhibitionId },
        relations: ['ticketUrl']
      });
      
      // Проверяем наличие шаблона билета в выставке
      if (visitorData.exhibition && exhibition.ticketUrl) {
        // Получаем информацию о шаблоне билета
        const ticketId = exhibition.ticketUrl.id;
        const ticket = await this.TicketRepository.findOne({
          where: { id: ticketId },
        });
        
        this.logger.log(`Данные шаблона билета: ${JSON.stringify(ticket)}`);
  
        if (!ticket) {
          this.logger.warn(`Шаблон билета с ID ${ticketId} не найден`);
          return this.generateDefaultPdfTicket(visitorData);
        }
  
        try {
          // Проверяем существование файлов
          await fs.access(qrPath);
          
          // Нормализуем путь к изображению шаблона
          const imagePath = ticket.image.replace(/^\/public/, 'public');
          const templateImagePath = path.resolve(process.cwd(), imagePath);
          
          this.logger.log(`Путь к шаблону: ${templateImagePath}`);
          this.logger.log(`Путь к QR-коду: ${qrPath}`);
          
          await fs.access(templateImagePath);
  
          // Получаем информацию об изображении шаблона
          const templateMetadata = await sharp(templateImagePath).metadata();
          this.logger.log(`Размеры шаблона: ${templateMetadata.width}x${templateMetadata.height}`);
          
          // Читаем QR-код и изображение шаблона
          const qrBuffer = await fs.readFile(qrPath);
          const templateBuffer = await fs.readFile(templateImagePath);
  
          // ИСПРАВЛЕНИЕ: Всегда используем процентные значения, если они доступны
          let x, y, width, height;
          
          if (ticket.xPercent !== undefined && ticket.xPercent !== null && 
              ticket.yPercent !== undefined && ticket.yPercent !== null && 
              ticket.wPercent !== undefined && ticket.wPercent !== null && 
              ticket.hPercent !== undefined && ticket.hPercent !== null) {
            
            // Используем процентные значения
            this.logger.log(`Используем процентные значения: xPercent=${ticket.xPercent}, yPercent=${ticket.yPercent}, wPercent=${ticket.wPercent}, hPercent=${ticket.hPercent}`);
            
            // Преобразуем проценты в пиксели на основе реальных размеров изображения
            x = Math.round((ticket.xPercent / 100) * templateMetadata.width);
            y = Math.round((ticket.yPercent / 100) * templateMetadata.height);
            width = Math.round((ticket.wPercent / 100) * templateMetadata.width);
            height = Math.round((ticket.hPercent / 100) * templateMetadata.height);
            
            this.logger.log(`Рассчитанные координаты из процентов: x=${x}, y=${y}, width=${width}, height=${height}`);
          } else {
            // Используем абсолютные значения только если процентные недоступны
            this.logger.log(`Процентные значения не найдены, используем абсолютные значения: x=${ticket.x}, y=${ticket.y}, w=${ticket.w}, h=${ticket.h}`);
            
            // Преобразуем строковые значения в числа
            x = parseInt(String(ticket.x), 10);
            y = parseInt(String(ticket.y), 10);
            width = parseInt(String(ticket.w), 10);
            height = parseInt(String(ticket.h), 10);
          }
          
          this.logger.log(`Итоговые координаты QR-кода: x=${x}, y=${y}, width=${width}, height=${height}`);
  
          // Изменяем размер QR-кода в соответствии с шаблоном
          const resizedQrBuffer = await sharp(qrBuffer)
            .resize({
              width: width,
              height: height,
              fit: 'fill'
            })
            .toBuffer();
          
          this.logger.log(`QR-код изменен до размеров: ${width}x${height}`);
  
          // Накладываем QR-код на шаблон
          const result = await sharp(templateBuffer)
            .composite([
              {
                input: resizedQrBuffer,
                top: y,
                left: x,
              },
            ])
            .toBuffer();
          
          this.logger.log('QR-код наложен на шаблон');
  
          // Конвертируем в base64 для вставки в HTML
          const base64Image = result.toString('base64');
          const imageWithQr = `data:image/jpeg;base64,${base64Image}`;
  
          // Создаем HTML для PDF с сохранением пропорций изображения
          const html = `
            <html>
              <head>
                <style>
                  body { 
                    margin: 0; 
                    padding: 0; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                  }
                  .ticket-container { 
                    max-width: 100%;
                    max-height: 100vh;
                    display: flex;
                    justify-content: center;
                  }
                  .ticket-image { 
                    max-width: 100%;
                    max-height: 100vh;
                    object-fit: contain;
                  }
                </style>
              </head>
              <body>
                <div class="ticket-container">
                  <img src="${imageWithQr}" class="ticket-image" />
                </div>
              </body>
            </html>
          `;
  
          // Генерируем PDF с учетом размеров изображения
          const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          });
  
          const page = await browser.newPage();
          await page.setContent(html, { waitUntil: 'networkidle0' });
          
          // Устанавливаем размер PDF в соответствии с размером изображения
          const pdfBuffer = await page.pdf({ 
            format: 'A4',
            printBackground: true,
            margin: {
              top: '0',
              right: '0',
              bottom: '0',
              left: '0'
            }
          });
  
          await browser.close();
          
          this.logger.log('PDF успешно сгенерирован');
          return pdfBuffer;
        } catch (error) {
          this.logger.error(
            `Ошибка при генерации PDF с шаблоном: ${error.message}`,
            error.stack
          );
          return this.generateDefaultPdfTicket(visitorData);
        }
      } else {
        this.logger.log('Шаблон билета не найден, используем стандартный шаблон');
        return this.generateDefaultPdfTicket(visitorData);
      }
    } catch (error) {
      this.logger.error(`Общая ошибка при генерации PDF билета: ${error.message}`);
      throw error;
    }
  }
  async generateDefaultPdfTicket(visitor: Visitor): Promise<any> {
    // Путь к QR-коду
    const qrPath = path.resolve(
      process.cwd(),
      visitor.qrValue.replace(/^\/public/, 'public'),
    );

    // Читаем и кодируем QR как base64
    const qrBuffer = await fs.readFile(qrPath);
    const base64QR = qrBuffer.toString('base64');
    const qrImg = `data:image/png;base64,${base64QR}`;

    const html = getHtmlMessage(visitor, qrImg);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();
    return pdfBuffer;
  }
  

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  async remove(id: number): Promise<{ message: string }> {
    const visitor = await this.VisitorRepository.findOneBy({ id });
  
    if (!visitor) {
      throw new HttpException('Посетитель не найден', HttpStatus.NOT_FOUND);
    }
  
    await this.VisitorRepository.remove(visitor);
  
    return { message: 'Посетитель успешно удалён' };
  }
}
