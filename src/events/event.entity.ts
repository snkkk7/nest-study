import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity('event')
export class Event {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length:100})
    name:string;

    @Column()
    description:string;

    @Column()
    when:Date;

    @Column()
    address: string;

    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        cascade: true
      })
      attendees: Attendee[];
}