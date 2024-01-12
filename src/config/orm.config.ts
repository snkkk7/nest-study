import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendee } from 'src/events/attendee.entity';
import { Event } from './../events/event.entity';
import { Subject } from '../school/subject.entity';
import { Teacher } from '../school/teacher.entity';
import { User } from '../auth/user.entity';
import { Profile } from '../auth/profile.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: 'postgres',
    password:'1234',
    database: process.env.DB_NAME,
    entities: [Event, Attendee,Subject,Teacher,User,Profile],
    synchronize: true
  })
);