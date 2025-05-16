import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/jwt.strategy';
import { TestController } from './test/test.controller';
import { ProxyController } from './proxy.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'maplestory-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    AppController,
    TestController,
    ProxyController
  ],
  providers: [
    AppService,
    JwtStrategy
  ],
})
export class AppModule {}
