import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

/**
 * 유저 대상 이벤트 스키마
 * 특정 조건을 만족할 경우 보상을 지급하기 위한 이벤트 정의
 */
@Schema({ timestamps: true })
export class Event {
  /** 이벤트 이름 */
  @Prop({ required: true })
  title: string;

  /** 설명 (선택) */
  @Prop()
  description: string;

  /**
   * 보상 조건 유형
   * 예: 'login', 'invite'
   */
  @Prop({ required: true })
  condition: string;

  /**
   * 조건 수치
   * 예: 3 (3일 로그인, 3명 초대 등)
   */
  @Prop({ required: true })
  amount: number;

  /**
   * 조건 단위
   * 예: 'days', 'friends'
   */
  @Prop({ required: true })
  unit: string;

  /**
   * 이벤트 상태
   * - ACTIVE: 참여 가능
   * - INACTIVE: 비활성화
   */
  @Prop({ required: true, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /** 시작일 (선택) */
  @Prop()
  startedAt: Date;

  /** 종료일 (선택) */
  @Prop()
  endedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
