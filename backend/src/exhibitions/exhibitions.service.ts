import { Injectable } from '@nestjs/common';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { Repository } from 'typeorm';
import { Organizer } from 'src/organizers/entities/organizer.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Injectable()
export class ExhibitionsService {
  constructor(
    @InjectRepository(Exhibition)
    private ExhibitionRepository: Repository<Exhibition>,
    @InjectRepository(Ticket)
    private TicketRepository: Repository<Ticket>,
  ){}

  async create(dto: CreateExhibitionDto) {
    const ticketUrl = await this.TicketRepository.findOneBy({id: Number(dto.ticketUrl)})
    let newExhibition = this.ExhibitionRepository.create({...dto, ticketUrl})
    return await this.ExhibitionRepository.save(newExhibition)
   
  }

  async addToArchive(id: number) {
    const exhibition = await this.ExhibitionRepository.findOne({
      where: { id },
    })

    if (exhibition) {
      exhibition.archive = true
      return await this.ExhibitionRepository.save(exhibition)
    }

    return null
  }

  async removeFromArchive(id: number) {
    const exhibition = await this.ExhibitionRepository.findOne({
      where: { id },
    })

    if (exhibition) {
      exhibition.archive = false
      return await this.ExhibitionRepository.save(exhibition)
    }

    return null
  }

  async findAll(query) {
    const { main } = query;

    const queryOptions: any = {
        relations: {
            organizer: true, // Подгружаем связанную сущность Organizer
        },
    };

    if (main !== undefined) {
        queryOptions.where = {
            organizer: {
                isMain: main === 'true' ? true : false, // Преобразуем строку в булево значение
            },
        };
    }

    const exhibitions = await this.ExhibitionRepository.find(queryOptions);
    return exhibitions;
}

  async findOne(id: number) {
    return await this.ExhibitionRepository.findOneBy({id})
  }

  async update(id: number, updateExhibitionDto: UpdateExhibitionDto) {
    const ticketUrl = await this.TicketRepository.findOneBy({id: Number(updateExhibitionDto.ticketUrl)})
    // Обновляем данные
    await this.ExhibitionRepository.update(id, {...updateExhibitionDto, ticketUrl});
  
    // Находим и возвращаем обновленный объект
    return this.ExhibitionRepository.findOneBy({id}, );
  }
  

  async remove(id: number) {
    return await this.ExhibitionRepository.delete(id)
  }
}
