import { Controller, Get, Req, UseGuards } from "@nestjs/common";
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
  async findMyRequests(@Req() req: any) {
    const userId = req.user.sub;
    return this.service.findAllRequests(userId);
  }
}