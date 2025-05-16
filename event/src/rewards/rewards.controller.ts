import { Body, Controller, Param, Post } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('events/:id/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  async create(@Param('id') eventId: string, @Body() dto: any) {
    return this.rewardsService.createReward(eventId, dto);
  }
}