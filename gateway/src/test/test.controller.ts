import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('test')
export class TestController {
  @Get('secure')
  @UseGuards(JwtAuthGuard)
  getSecure(@Req() req) {
    return {
      message: 'JWT 인증된 사용자 접근 성공',
      user: req.user,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdmin(@Req() req) {
    return {
      message: 'ADMIN 전용 API 접근 성공',
      user: req.user,
    };
  }
}
