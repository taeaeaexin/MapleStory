import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/events.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {
    console.log('injected Event Model:', !!eventModel);
  }

  async createEvent(dto: any): Promise<Event> {
    return this.eventModel.create(dto);
  }

  async findAllEvents(): Promise<Event[]> {
  try {
    console.log('model ready?', !!this.eventModel);
    return await this.eventModel.find().exec();
  } catch (err) {
    console.error('Error in findAllEvents:', err.message, err.stack);
    throw err;
  }
  }
}
