import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [TypeOrmModule.forRoot({
        type:"postgres",
        host:'localhost',
        port:5432,
        username:'postgres',
        password:"1234",
        database:process.env.DB_NAME,
        entities:[Event],
        synchronize:true
      }),
      TypeOrmModule.forFeature([Event])
    ],
    controllers:[EventsController],
    providers:[EventsService],
    
})
export class EventsModule {
    
}
