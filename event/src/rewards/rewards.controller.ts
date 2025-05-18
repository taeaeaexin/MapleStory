import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { Public } from 'src/common/public.decorator';

@Controller('events/:id/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // OPERATOR만 보상 생성 가능
  @Roles(Role.OPERATOR)
  @Post()
  async create(@Param('id') eventId: string, @Body() dto: any) {
    return this.rewardsService.createReward(eventId, dto);
  }

  // 이벤트 보상은 jwt가 없어도 누구나 볼 수 있음
  @Public()
  @Get()
  async findAll(@Param('id') eventId: string) {
    return this.rewardsService.findRewardsByEventId(eventId);
  }
}