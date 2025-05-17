import {
  Controller,
  Get,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('events')
export class EventProxyController {
  constructor(private readonly httpService: HttpService) {}
  @Get()
  async getEvents() {
    const res = await firstValueFrom(
      this.httpService.get('http://event:3000/events'),
    );
    return res.data;
  }

  @Post()
  async createEvent(@Body() body: any, @Req() req: any) {
    const token = req.headers.authorization;
    const res = await firstValueFrom(
      this.httpService.post('http://event:3000/events', body, {
        headers: { Authorization: token },
      }),
    );
    return res.data;
  }

  @Post(':id/rewards')
  async createReward(@Req() req: any, @Body() body: any) {
    const eventId = req.params.id;
    const token = req.headers.authorization;
    const res = await firstValueFrom(
      this.httpService.post(`http://event:3000/events/${eventId}/rewards`, body, {
        headers: { Authorization: token },
      }),
    );
    return res.data;
  }

}
