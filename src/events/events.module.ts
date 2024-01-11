import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Event,Attendee])
    ],
    controllers:[EventsController],
    providers:[EventsService],
    
})
export class EventsModule {
    
}
