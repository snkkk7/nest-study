import { Injectable } from '@nestjs/common';
import { Event } from "./event.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';



@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly repository:Repository<Event>
    ) {}


    
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
