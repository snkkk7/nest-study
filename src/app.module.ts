import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AppJapaneseService } from './japan.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import { SchoolModule } from './school/school.module';


@Module({

    imports:[
        ConfigModule.forRoot({
            isGlobal: true,
            load: [ormConfig],
            expandVariables: true
          }),
          TypeOrmModule.forRootAsync({
            useFactory: ormConfig
          }),
          EventsModule,
          SchoolModule
          ],

    providers: [
                {
                    provide:AppService,
                    useClass:AppJapaneseService
                },
                {
                    provide:"APP_NAME",
                    useValue:"Nest backend!!"
                },
                {
                    provide:"MESSAGE",
                    inject:[AppDummy],
                    useFactory:(app) => `${app.dummy()} Factory!!!`
                },AppDummy

],

    controllers: [AppController],
    

})
export class AppModule {}
