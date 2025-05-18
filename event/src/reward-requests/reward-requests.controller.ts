import { Controller, Post, Param, Body, Get, Query, Req, UseGuards } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';

@Controller('events/:id/reward-request')
export class RewardRequestsController {
  constructor(private readonly service: RewardRequestsService) {}

  // jwt에서 userid 추출하기 위해서 AuthGuard 적용 필요
  // user 보상 요청
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER)
  @Post()
  async requestReward(@Param('id') eventId: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.service.requestReward(userId, eventId);
  }
}
