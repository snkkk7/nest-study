import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update-event.dto";
import { EventsService } from "./events.service";

@Controller('/events')
export class EventsController  {

    constructor(private readonly eventsService : EventsService){}

    @Get()
    async findAll(){

        return await this.eventsService.findAll()

    }

    @Get(":id")
    async findOne(@Param("id",ParseIntPipe) id: number){
    
        return await this.eventsService.findOne(id)

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


