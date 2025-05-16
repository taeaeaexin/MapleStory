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
    const result = await firstValueFrom(
      this.httpService.post('http://auth:3000/signup', req.body)
    );
    res.status(result.status).send(result.data);
  }

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const result = await firstValueFrom(
      this.httpService.post('http://auth:3000/login', req.body)
    );
    res.status(result.status).send(result.data);
  }
}
