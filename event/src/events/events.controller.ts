import { Body, Controller, Post, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { Public } from 'src/common/public.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // OPERATOR만 이벤트 생성 가능
  @Roles(Role.OPERATOR)
  @Post()
  async create(@Body() dto: any) {
    return this.eventsService.createEvent(dto);
  }

  // 이벤트는 jwt가 없어도 누구나 볼 수 있음
  @Public()
  @Get()
  async findAll() {
    return this.eventsService.findAllEvents();
  }
}