import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './events/schemas/events.schema';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { Reward, RewardSchema } from './rewards/schemas/reward.schema';
import { RewardsService } from './rewards/rewards.service';
import { RewardsController } from './rewards/rewards.controller';
import { RewardRequest, RewardRequestSchema } from './reward-requests/schemas/rewrad-request.schema';
import { RewardRequestsController } from './reward-requests/reward-requests.controller';
import { RewardRequestsService } from './reward-requests/reward-requests.service';
import { RewardRequestsAdminController } from './reward-requests/reward-requests.admin.controller';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { RolesGuard } from './common/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/jwt.strategy';
import { EventSeeder } from './seeder/event.seeder';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'maplestory-secret',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/event'),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
  ],
  controllers: [
    AppController,
    EventsController,
    RewardsController,
    RewardRequestsController,
    RewardRequestsAdminController,
  ],
  providers: [
    EventSeeder,
    AppService,
    EventsService,
    RewardsService,
    RewardRequestsService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
