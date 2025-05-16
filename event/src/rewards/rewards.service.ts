import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Model } from 'mongoose';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async createReward(eventId: string, dto: any): Promise<Reward> {
    return this.rewardModel.create({
      ...dto,
      eventId,
    });
  }

  async findRewardsByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId }).exec();
  }
}