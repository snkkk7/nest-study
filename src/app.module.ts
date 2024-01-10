import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AppJapaneseService } from './japan.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';


@Module({

    imports:[EventsModule,ConfigModule.forRoot()],

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
