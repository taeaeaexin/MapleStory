import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { RewardsService } from '../rewards/rewards.service';
import { EventDocument } from '../events/schemas/events.schema';

@Injectable()
export class EventSeeder implements OnModuleInit {
  constructor(
    private readonly eventsService: EventsService,
    private readonly rewardsService: RewardsService,
  ) {}

  async onModuleInit() {
    const events = await this.eventsService.findAllEvents();
    if (events.length > 0) return;

    /* 이벤트 생성 */
    const event: EventDocument = await this.eventsService.createEvent({
        title: '7일 출석 이벤트',
        description: '7일 연속 접속하면 보상을 드립니다.',
        condition: 'attendance',
        amount: 7,
        unit: 'days',
        status: 'ACTIVE',
    });

    /* 보상 생성 */
    await this.rewardsService.createReward(event._id.toString(), {
        name: '메소',
        rewardType: 'MONEY',
        amount: 10000,
    });
  }
}
