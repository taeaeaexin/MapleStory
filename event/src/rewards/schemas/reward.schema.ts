import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardDocument = Reward & Document;

/**
 * 보상 스키마
 * 요구사항에 맞춰 보상 명확히 정의
 */
@Schema({ timestamps: true })
export class Reward {
  /** 보상 종류: ITEM | POINT | COUPON | MONEY */
  @Prop({ required: true })
  rewardType: 'ITEM' | 'POINT' | 'COUPON' | 'MONEY';

  /**
   * 보상 이름
   * 예: 'ITEM, 이블윙즈' 'MONEY, 메소' 등
   */
  @Prop({ required: true })
  name: string;

  /** 보상 수량 */
  @Prop({ required: true })
  amount: number;

  /** 연결된 이벤트 ID */
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
