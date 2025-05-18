import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Controller('reward-requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
export class RewardRequestsAdminController {
  constructor(
    private readonly service: RewardRequestsService,
  ) {}

  // 보상 요청 이력 보기 (관리자 전용)
  // + userId -> email 조회 (편의성) - 1시간 훨씬넘게 구현하다가 실패
  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.service.findAllRequests(userId);
  }
}
