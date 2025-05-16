import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('events/:id/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Roles(Role.OPERATOR)
  @Post()
  async create(@Param('id') eventId: string, @Body() dto: any) {
    return this.rewardsService.createReward(eventId, dto);
  }

  @Get()
  async findAll(@Param('id') eventId: string) {
    return this.rewardsService.findRewardsByEventId(eventId);
  }
}