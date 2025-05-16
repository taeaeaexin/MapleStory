import { Body, Controller, Post, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles(Role.OPERATOR)
  @Post()
  async create(@Body() dto: any) {
    return this.eventsService.createEvent(dto);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAllEvents();
  }
}