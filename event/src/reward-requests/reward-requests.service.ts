import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardRequest, RewardRequestDocument } from './schemas/rewrad-request.schema';
import { Model } from 'mongoose';

@Injectable()
export class RewardRequestsService {
  constructor(
    @InjectModel(RewardRequest.name) private model: Model<RewardRequestDocument>,
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

    // 조건 검증 없이 바로 승인 처리 (임시용)
    return this.model.create({
      userId,
      eventId,
      status: 'APPROVED',
    });
  }
}
