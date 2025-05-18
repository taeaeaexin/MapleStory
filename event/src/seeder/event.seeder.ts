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

        /* 조건:7 x Days -> 보상:ITEM x 1 */
        const LoginEvent: EventDocument = await this.eventsService.createEvent({
            title: '어린이날 출석 이벤트',
            description: '7일을 접속하면 보상을 드려요!',
            condition: 'login',
            amount: 7,
            unit: '일', //단위
            status: 'ACTIVE',
        });
        await this.rewardsService.createReward(LoginEvent._id.toString(), {
            name: '하늘색 서핑보드',
            rewardType: 'ITEM',
            amount: 1,
        });

        /* 조건:3 x Friends -> 보상:POINT x 2 */
        const InviteEvent: EventDocument = await this.eventsService.createEvent({
            title: '어버이날 초대 이벤트',
            description: '친구 2명을 초대하면 보상을 드려요!',
            condition: 'invite',
            amount: 2,
            unit: '명', //단위
            status: 'ACTIVE',
        });
        await this.rewardsService.createReward(InviteEvent._id.toString(), {
            name: '메이플 포인트',
            rewardType: 'POINT',
            amount: 5000,
        });

        /* 조건:1000 x Monsters -> 보상:COUPON x 2 */
        const HuntEvent: EventDocument = await this.eventsService.createEvent({
            title: '스승의날 사냥 이벤트',
            description: '1000마리를 사냥하면 보상을 드려요!',
            condition: 'kill',
            amount: 1000,
            unit: '마리', //단위
            status: 'ACTIVE',
        });
        await this.rewardsService.createReward(HuntEvent._id.toString(), {
            name: '로얄 스타일',
            rewardType: 'COUPON',
            amount: 2,
        });
    }
}
