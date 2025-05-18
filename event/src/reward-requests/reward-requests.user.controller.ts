import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/common/roles.decorator";
import { Role } from "src/common/roles.enum";
import { RolesGuard } from "src/common/roles.guard";
import { RewardRequestsService } from "./reward-requests.service";

@Controller('my-reward-requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.USER)
export class RewardRequestsUserController {
  constructor(private readonly service: RewardRequestsService) {}

  @Get()
  async getMyRewardRequests(@Req() req) {
    const userId = req.user.sub;

    const statusRaw = req.query?.status;
    const eventIdRaw = req.query?.eventId;

    const status = Array.isArray(statusRaw) ? statusRaw[0] : statusRaw;
    const eventId = Array.isArray(eventIdRaw) ? eventIdRaw[0] : eventIdRaw;

    console.log('req.url =', req.url);
    console.log('[QUERY]', { status, eventId });

    return this.service.findAllRequests({
      userId,
      eventId,
      status,
    });
  }
}