import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('events')
export class EventProxyController {
  constructor(private readonly httpService: HttpService) {}

  /* 이벤트 목록 조회 (ALL) */
  @Get()
  async getEvents() {
    const res = await firstValueFrom(
      this.httpService.get('http://event:3000/events'),
    );
    return res.data;
  }

  /* 이벤트 등록 (OPERATOR) */
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

  /* 보상 목록 조회 (ALL) */
  @Get(':id/rewards')
  async getRewards(@Req() req: any) {
    const eventId = req.params.id;
    const token = req.headers.authorization;
    const res = await firstValueFrom(
      this.httpService.get(`http://event:3000/events/${eventId}/rewards`, {
        headers: { Authorization: token },
      }),
    );
    return res.data;
  }

  /* 보상 등록 (OPERATOR) */
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

  /* 보상 요청 (USER) */
  @Post(':id/reward-request')
  async requestReward(@Req() req: any, @Body() body: any) {
    const eventId = req.params.id;
    const token = req.headers.authorization;
    const res = await firstValueFrom(
    this.httpService.post(
      `http://event:3000/events/${eventId}/reward-request`,
      body,
      { headers: {Authorization:token} }, // body 없음. 유저 ID는 JWT에서 추출되므로 Event Server에서 처리 -> 였는데 body에서 inventory를 가져와야하는걸로 변경
    ),
  );
  return res.data;
  }
}
