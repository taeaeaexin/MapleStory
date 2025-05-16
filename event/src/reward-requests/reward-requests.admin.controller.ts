import { Controller, Get, Query } from '@nestjs/common';
import { RewardRequestsService } from './reward-requests.service';

@Controller('reward-requests')
export class RewardRequestsAdminController {
  constructor(private readonly service: RewardRequestsService) {}

  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.service.findAllRequests(userId);
  }
}
