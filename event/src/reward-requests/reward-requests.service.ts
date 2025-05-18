import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestDocument } from './schemas/reward-request.schema';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from 'src/events/schemas/events.schema';

@Injectable()
export class RewardRequestsService {
    constructor(
        @InjectModel(RewardRequest.name) private model: Model<RewardRequestDocument>,
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    ) {}

    async requestReward(userId: string, eventId: string, inventory: Record<string, number>): Promise<RewardRequest> {
        if (!userId) {
            throw new Error('userId is not exist');
        }

        const existing = await this.model.findOne({ userId, eventId }).sort({ createdAt: -1 }); // 최신 요청 이력

        if (existing) {
            if (existing.status === 'APPROVED') {
                return {
                    ...existing.toObject(),
                    status: 'REJECTED',
                    reason: '이미 참여한 이벤트입니다.',
                } as RewardRequest;
            }

            if (existing.status === 'PENDING') {
                return {
                    ...existing.toObject(),
                    status: 'REJECTED',
                    reason: '이벤트 처리 대기중입니다.',
                } as RewardRequest;
            }

            // REJECTED 재요청 허용 (조건 만족 못했을 시 재시도)
        }

        console.log('[eventModel is]', this.eventModel);
        const event = await this.eventModel.findById(eventId); // RewardRequest validation failed: userId: Path `userId` is required.
        if (!event) {
            throw new Error('존재하지 않는 이벤트입니다.');
        }

        const passed = this.verifyCondition(event.condition, event.amount, event.unit, inventory);

        return this.model.create({
            userId,
            eventId,
            status: passed ? 'APPROVED' : 'REJECTED',
            reason: passed ? null : '조건 불충족',
        });
    }

    verifyCondition(
        condition: string,
        amount: number,
        unit: string,
        inventory: Record<string, number>
    ): boolean {
        console.log('검증:', { condition, amount, unit, inventory });

        if (!inventory || typeof inventory !== 'object') {
            console.error('inventory가 없음 또는 잘못됨:', inventory);
            return false;
        }

        const userAmount = inventory[condition];
        if (typeof userAmount !== 'number') {
            console.warn(`inventory에 [${condition}] 없음`);
            return false;
        }

        console.log(`유저 보유 수량: ${userAmount}, 필요 수량: ${amount}`);
        return userAmount >= amount;
    }

    async findAllRequests({
        userId,
        eventId,
        status,
    }: {
        userId?: string;
        eventId?: string;
        status?: string | string[];
    }) {
        const filter: any = {};
        if (userId) filter.userId = userId;
        if (eventId) filter.eventId = eventId;

        const statusValue = Array.isArray(status) ? status[0] : status;

        if (typeof statusValue === 'string') {
            const cleaned = statusValue.trim().toUpperCase();
            if (['APPROVED', 'REJECTED', 'PENDING'].includes(cleaned)) {
                filter.status = cleaned;
            }
        }

        console.log('[FILTER]', filter); //제발제발
        return this.model.find(filter);
    }
}
