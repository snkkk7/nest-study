import { Injectable } from '@nestjs/common';
import { Event } from "./event.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Attendee } from './attendee.entity';



@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly repository:Repository<Event>
    ) {}


    async practice2(){

            // return await this.repository.findOne(
      //   1,
      //   { relations: ['attendees'] }
      // );
      const event = await this.repository.findOne(
        { relations: ['attendees'],where:{id:1} }
      );
      // const event = new Event();
      // event.id = 1;
  
      const attendee = new Attendee();
      attendee.name = 'Using cascade';
      // attendee.event = event;
  
      event.attendees.push(attendee);
      // event.attendees = [];
  
      // await this.attendeeRepository.save(attendee)
      await this.repository.save(event);
  
      return event;

    }

    
    async findAll(){

       return this.repository.find()

    }

    async findOne(id: number){

        return await this.repository.findOne({where:{id}})

    }
    
    async create(input : CreateEventDto){

        return await this.repository.save({
            ...input,
            when: new Date(input.when)
          });

    }

    async update(input:UpdateEventDto,id: number){
        const event = await this.repository.findOne({where:{id}});

        return await this.repository.save({
          ...event,
          ...input,
          when: input.when ? new Date(input.when) : event.when
        });
    
    }

    async remove(id : number){
        const event = await this.repository.findOne({where:{id}});
        await this.repository.remove(event);
    }

}
