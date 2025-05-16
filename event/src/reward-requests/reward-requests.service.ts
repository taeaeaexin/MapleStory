import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestDocument } from './schemas/rewrad-request.schema';
import { Model } from 'mongoose';
import { EventDocument } from 'src/events/schemas/events.schema';

@Injectable()
export class RewardRequestsService {
  constructor(
    @InjectModel(RewardRequest.name) private model: Model<RewardRequestDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

    async requestReward(userId: string, eventId: string): Promise<RewardRequest> {
        const exists = await this.model.findOne({ userId, eventId });
        if (exists) {
            return {
                ...exists.toObject(),
                status: 'REJECTED',
                reason: '이미 요청한 이벤트입니다.',
            } as RewardRequest;
        }

        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new Error('존재하지 않는 이벤트입니다.');
        }

        const passed = await this.verifyCondition(event.condition, userId);

        return this.model.create({
            userId,
            eventId,
            status: passed ? 'APPROVED' : 'REJECTED',
            reason: passed ? null : '조건 불충족',
        });
    }

    // 테스트용
    async verifyCondition(condition: string, userId: string): Promise<boolean> {
        switch (condition) {
            case 'login7days':
            // id taesin (임시)
            return userId === 'taesin';

            case 'invite3friends':
            // 향후 구현 가능성 고려
            return false;

            default:
            return false;
        }
    }
}
