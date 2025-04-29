// ticket.entity.ts
import { Exhibition } from 'src/exhibitions/entities/exhibition.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  // Изменяем тип на float и храним значения от 0 до 100 (проценты)
  @Column('float')
  xPercent: number;

  @Column('float')
  yPercent: number;

  @Column('float')
  wPercent: number;

  @Column('float')
  hPercent: number;

  // Можно оставить старые поля для обратной совместимости
  // или создать миграцию для преобразования существующих данных
  @Column('float', { nullable: true })
  x: number;

  @Column('float', { nullable: true })
  y: number;

  @Column('float', { nullable: true })
  w: number;

  @Column('float', { nullable: true })
  h: number;

  @OneToMany(() => Exhibition, (exhibition) => exhibition.ticketUrl)
  exhibition:Exhibition
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}