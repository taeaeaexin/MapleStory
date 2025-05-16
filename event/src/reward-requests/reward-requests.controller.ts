import { Controller, Post, Param, Body, Get, Query } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('events/:id/reward-request')
export class RewardRequestsController {
  constructor(private readonly service: RewardRequestsService) {}

  @Roles(Role.USER)
  @Post()
  async requestReward(@Param('id') eventId: string, @Body() body: any) {
    const userId = body.userId;
    return this.service.requestReward(userId, eventId);
  }
}
