import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const exists = await this.usersService.findByEmail(email);
    if (exists) {
      throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.CONFLICT);
    }

    const user = await this.usersService.create(email, password) as UserDocument;

    return {
      message: '회원가입 성공',
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }
}
