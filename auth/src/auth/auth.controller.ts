import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.usersService.findByEmail(email) as UserDocument;

    if (!user) {
      throw new HttpException('존재하지 않는 이메일입니다.', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('비밀번호가 틀렸습니다.', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      sub: user._id,
      role: user.role,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: '로그인 성공',
      token,
    };
  }
}
