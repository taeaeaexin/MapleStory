import { Controller, Get, Query } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('reward-requests')
export class RewardRequestsAdminController {
  constructor(private readonly service: RewardRequestsService) {}

  @Roles(Role.OPERATOR, Role.ADMIN, Role.AUDITOR)
  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.service.findAllRequests(userId);
  }
}
