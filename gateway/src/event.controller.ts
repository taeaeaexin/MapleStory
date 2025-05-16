import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../src/common/jwt-auth.guard';
import { Role } from '../src/common/roles.enum';
import { Roles } from '../src/common/roles.decorator';
import { RolesGuard } from '../src/common/roles.guard';

@Controller('events')
export class EventController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getEvents() {
    const res = await firstValueFrom(
      this.httpService.get('http://event-server:3002/events'),
    );
    return res.data;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async createEvent(@Body() body: any, @Req() req: any) {
    const token = req.headers.authorization;
    const res = await firstValueFrom(
      this.httpService.post('http://event-server:3002/events', body, {
        headers: { Authorization: token },
      }),
    );
    return res.data;
  }
}
