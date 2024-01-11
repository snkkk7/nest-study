import { Injectable, Logger } from '@nestjs/common';
import { Event } from "./event.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { Attendee, AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { PaginateOptions, paginate } from '../pagination/paginator';



@Injectable()
export class EventsService {

  private readonly logger = new Logger(EventsService.name)

    constructor(
        @InjectRepository(Event)
        private readonly repository:Repository<Event>
    ) {}

    private getEventsBaseQuery(){

      return this.repository
            .createQueryBuilder('e')
            .orderBy('e.id','DESC')

    }

    public getEventWithAttendeeCountQuery(){

      return this.getEventsBaseQuery()
                  .loadRelationCountAndMap(
                    'e.attendeeCount','e.attendees'
                  )
                  .loadRelationCountAndMap(
                    'e.attendeeAccepted',
                    'e.attendees',
                    'attendee',
                    (qb) => qb
                              .where(
                                      'attendee.answer = :answer',
                                     {answer:AttendeeAnswerEnum.Accepted}
                                    )
                  ).loadRelationCountAndMap(
                    'e.attendeeRejected',
                    'e.attendees',
                    'attendee',
                    (qb) => qb
                              .where(
                                      'attendee.answer = :answer',
                                     {answer:AttendeeAnswerEnum.Rejected}
                                    )
                  )
                  .loadRelationCountAndMap(
                    'e.attendeeMaybe',
                    'e.attendees',
                    'attendee',
                    (qb) => qb
                              .where(
                                      'attendee.answer = :answer',
                                     {answer:AttendeeAnswerEnum.Maybe}
                                    )
                  )

    }

    public async getEvent(id:number): Promise<Event | undefined> {
      const query = this.getEventWithAttendeeCountQuery()
                  .andWhere('e.id = :id', {id})

      this.logger.debug(query.getSql())

      return await query.getOne()

    }

   private async getEventsWithAttendeeCountFiltered(filter?:ListEvents){

      let query = this.getEventWithAttendeeCountQuery()

      if(!filter){
        return query
      }

      this.logger.debug(filter)

      if(filter.when){
        
        this.logger.debug(filter.when)

        if(filter.when == WhenEventFilter.Today){

     

          query = query.andWhere(
            "e.when >= CURRENT_DATE AND e.when <= CURRENT_DATE + INTERVAL '1 day'"
          )
        }

        if(filter.when == WhenEventFilter.Tommorow){
          query = query.andWhere(
            `e.when >= CURRENT_DATE + INTERVAL '1 day' AND e.when <= CURRENT_DATE + INTERVAL '2 day'`
          )
        }

        if(filter.when == WhenEventFilter.ThisWeek){
            query = query.andWhere(
              `EXTRACT(WEEK FROM e.when) = EXTRACT(WEEK FROM CURRENT_DATE)`
            )
        }

        if(filter.when == WhenEventFilter.ThisWeek){
          query = query.andWhere(
            `EXTRACT(WEEK FROM e.when) = EXTRACT(WEEK FROM CURRENT_DATE + 1)`
          )
      }

      this.logger.log(query.getSql())

      return query

      }

    }

    public async getEventsWithAttendeeCountFilteredPaginated(
      filter:ListEvents,
      paginateOptions:PaginateOptions
    ){
      return paginate(
        await this.getEventsWithAttendeeCountFiltered(filter),
        paginateOptions
      )
    }

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

    
    // async findAll(filter:FilterList){

    //    const events = await this.getEventsWithAttendeeCountFiltered(filter)

    // }

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
