import {
  Controller, Post, Req, Res
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProxyController {
  constructor(private readonly httpService: HttpService) {}

    @Post('/signup')
    async signup(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await firstValueFrom(
                this.httpService.post('http://auth:3000/signup', req.body)
            );
            res.status(result.status).send(result.data);
        } catch (err: any) {
            const status = err.response?.status || 500;
            const data = err.response?.data || { message: 'Gateway error' };
            res.status(status).send(data); // 409 error 처리
        }
    }

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response) {
        try { // 예외처리 추가
            const result = await firstValueFrom(
                this.httpService.post('http://auth:3000/login', req.body)
        );
            res.status(result.status).send(result.data);
        } catch (err: any) {
            const status = err.response?.status || 500;
            const data = err.response?.data || { message: 'Gateway error' };
            res.status(status).send(data);
        }
    }
}
