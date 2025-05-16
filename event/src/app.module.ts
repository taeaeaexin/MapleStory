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


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/event'),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  controllers: [AppController, EventsController, RewardsController],
  providers: [AppService, EventsService, RewardsService],
})
export class AppModule {}
