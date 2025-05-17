import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/jwt.strategy';
import { TestController } from './test/test.controller';
import { AuthProxyController } from './auth.proxy.controller';
import { EventProxyController } from './event.proxy.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'maplestory-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    AppController,
    TestController,
    AuthProxyController,
    EventProxyController,
  ],
  providers: [
    AppService,
    JwtStrategy
  ],
})
export class AppModule {}
