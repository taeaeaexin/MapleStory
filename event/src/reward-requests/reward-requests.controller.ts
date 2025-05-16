import { Controller, Post, Param, Body, Get, Query } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';

@Controller('events/:id/reward-request')
export class RewardRequestsController {
  constructor(private readonly service: RewardRequestsService) {}

  @Post()
  async requestReward(@Param('id') eventId: string, @Body() body: any) {
    const userId = body.userId;
    return this.service.requestReward(userId, eventId);
  }
}
