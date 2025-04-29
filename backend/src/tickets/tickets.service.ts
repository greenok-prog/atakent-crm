import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketsService {
  createOrUpdate(arg0: { id: number; name: any; image: any; imageUrl: string; x: number; y: number; w: number; h: number; xPercent: number; yPercent: number; wPercent: number; hPercent: number; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Ticket)
    private TicketRepository: Repository<Ticket>,
  ){}

  async create(createTicketDto: CreateTicketDto) {
    let newTicket = this.TicketRepository.create(createTicketDto)
    return await this.TicketRepository.save(newTicket)
  }

  async findAll() {
    return await this.TicketRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return this.TicketRepository.delete(id)
  }
}
