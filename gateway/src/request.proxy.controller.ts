import { HttpService } from "@nestjs/axios";
import { Controller, Get, Req } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Controller()
export class RequestProxyController {
  constructor(private readonly httpService: HttpService) {}

  /* 보상 요청 이력 조회 (AUDITOR, ADMIN, OPERATOR) */
  @Get('/reward-requests')
  async getRewardRequests(@Req() req: any) {
    const token = req.headers.authorization;
    const userId = req.query.userId;
    const res = await firstValueFrom(
      this.httpService.get('http://event:3000/reward-requests', {
        headers: { Authorization: token },
        params: userId ? { userId } : {}, // 쿼리 필터링 지원
      }),
    );
    return res.data;
  }

  /* 내 보상 요청 이력 조회 (USER) */
  @Get('/my-reward-requests')
  async getMyRewardRequests(@Req() req: any) {
    const token = req.headers.authorization;
    const { userId, eventId, status } = req.query; // 쿼리 전부 받아오기
    const res = await firstValueFrom(
      this.httpService.get('http://event:3000/my-reward-requests', {
        headers: { Authorization: token },
        params: {
          ...(status && { status }),
          ...(eventId && { eventId }),
          ...(status && { status }),
        },
      }),
      
    );
    return res.data;
  }
}
