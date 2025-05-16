import { Body, Controller, Post, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() dto: any) {
    return this.eventsService.createEvent(dto);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAllEvents();
  }
}