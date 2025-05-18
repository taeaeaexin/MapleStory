import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';

@Controller('reward-requests')
export class RewardRequestsAdminController {
  constructor(private readonly service: RewardRequestsService) {}

  // 보상 요청 이력 보기 (관리자 전용)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN, Role.AUDITOR)
  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.service.findAllRequests(userId);
  }
}
