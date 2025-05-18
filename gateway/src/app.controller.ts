import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { RolesGuard } from './common/roles.guard';
import { Roles } from './common/roles.decorator';
import { Role } from './common/roles.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // jwt 인증 + role 확인 + userId 확인
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('information')
  getSecureData(@Request() req): string {
    return `
    Email : ${req.user.email}
    Role : ${req.user.role}
    user ID : ${req.user.userId}
    `;
  }
}
