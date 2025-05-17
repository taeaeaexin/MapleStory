import { HttpService } from "@nestjs/axios";
import { Controller, Get, Req } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Controller('reward-requests')
export class RequestProxyController {
  constructor(private readonly httpService: HttpService) {}

  /* 보상 요청 이력 조회 (USER, AUDITOR, ADMIN) */
  @Get()
  async getRewardRequests(@Req() req: any) {
    const token = req.headers.authorization;
    const userId = req.query.userId;
    const res = await firstValueFrom(
      this.httpService.get('http://event:3000/reward-requests', {
        headers: { Authorization: token },
        params: userId ? { userId } : {},
      }),
    );
    return res.data;
  }
}
