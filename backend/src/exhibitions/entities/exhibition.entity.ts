import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Exhibitor } from 'src/exhibitors/entities/exhibitor.entity';
import { Visitor } from 'src/visitors/entities/visitor.entity';
import { Organizer } from 'src/organizers/entities/organizer.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';


@Entity()
export class Exhibition {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Exhibition identifier', nullable: false })
    id: number;

    @IsNotEmpty({ message: 'Имя должно быть заполнено' })
    @Column()
    @ApiProperty({ description: 'Exhibition name', nullable: false })
    name: string;

    @IsNotEmpty({ message: 'Описание должно быть заполнено' })
    @Column()
    @ApiProperty({ description: 'Exhibitions description', nullable: false })
    description: string;

    @IsNotEmpty({ message: 'Местоположение должно быть заполнено' })
    @Column()
    @ApiProperty({ description: 'Exhibitions location', nullable: false })
    location: string;

    @IsNotEmpty({ message: 'Веб-сайт должен быть заполнен' })
    @Column()
    @ApiProperty({ description: 'Exhibitions website', nullable: true })
    website: string;

    @IsNotEmpty({ message: 'Дата начала должна быть заполнена' })
    @Column()
    @ApiProperty({ description: 'Exhibition start date', nullable: false })
    dateStart: Date;

    @Column({default:false})
    @ApiProperty({description: 'is exhibition in archive', nullable:true})
    archive:Boolean

    @IsNotEmpty({ message: 'Дата окончания должна быть заполнена' })
    @Column()
    @ApiProperty({ description: 'Exhibition end date', nullable: false })
    dateEnd: Date;

    @IsNotEmpty({ message: 'Изображение должно быть заполнено' })
    @Column()
    @ApiProperty({ description: 'Exhibition image', nullable: true })
    image: string;

    @ManyToOne(() => Ticket, (ticket) => ticket.exhibition, { onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    @ApiProperty({ description: 'Exhibition ticket bg', nullable: true })
    ticketUrl: Ticket;

    @OneToMany(() => Exhibitor, (exhibitor) => exhibitor.exhibiton)
    exhibitors: Exhibitor[];

    @OneToMany(() => Visitor, (visitor) => visitor.exhibition)
    visitors: Visitor[];

    @ManyToOne(() => Organizer, (organizer) => organizer.exhibitions, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'organizer_id',  }) // Define the foreign key column explicitly
    organizer: Organizer;
    
    @Column({ name: 'organizer_id', nullable: true })
    organizer_id: number; // Add this to reference the organizer_id directly
    
}