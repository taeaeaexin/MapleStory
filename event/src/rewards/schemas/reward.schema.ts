import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  rewardType: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
