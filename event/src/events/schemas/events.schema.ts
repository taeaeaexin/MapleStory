import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  condition: string;

  @Prop()
  status: 'ACTIVE' | 'INACTIVE';

  @Prop()
  startedAt: Date;

  @Prop()
  endedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
