import { Body, Controller, Delete, Get, HttpCode, Logger, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./input/create-event.dto";
import { UpdateEventDto } from "./input/update-event.dto";
import { EventsService } from "./events.service";
import { ListEvents } from "./input/list.events";

@Controller('/events')
export class EventsController  {

    private readonly logger = new Logger(EventsController.name)

    constructor(private readonly eventsService : EventsService){}

    @Get()
    async findAll(@Query() filter:ListEvents){

        this.logger.log(filter.when)

        return await this.eventsService.getEventsWithAttendeeCountFiltered(filter)

    }

    // @Get('/practice')
    // async practice() {
    //   return await this.repository.find({
    //     select: ['id', 'when'],
    //     where: [{
    //       id: MoreThan(3),
    //       when: MoreThan(new Date('2021-02-12T13:00:00'))
    //     }, {
    //       description: Like('%meet%')
    //     }],
    //     take: 2,
    //     order: {
    //       id: 'DESC'
    //     }
    //   });
    // }

    @Get('practice2')
    async practice2() {
  
        const event = await this.eventsService.practice2()

        return event

    }

    @Get(":id")
    async findOne(@Param("id",ParseIntPipe) id: number){
    
        return await this.eventsService.getEvent(id)

    }



    @Post()
    async create(@Body(new ValidationPipe({groups:['create']})) input : CreateEventDto){

        return await this.eventsService.create(input)


     }

    @Patch(":id")
    async update(
                 @Param("id",ParseIntPipe) id : number ,
                 @Body(new ValidationPipe({groups:['update']})) input : UpdateEventDto
                ){
        
        return await this.eventsService.update(input,id)

    }

    @HttpCode(204)
    @Delete(":id")
    async remove(@Param("id",ParseIntPipe) id : number){

        await this.eventsService.remove(id)

    }
}


