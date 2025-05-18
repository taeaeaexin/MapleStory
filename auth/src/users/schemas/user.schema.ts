import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;
  
  /**
   * 인벤토리: 조건 아이템별 보유 수량
   * ex) 출석x3, 친구초대x2
   */
  @Prop({ type: Map, of: Number, default: {} })
  inventory: Map<string, number>;
}

export const UserSchema = SchemaFactory.createForClass(User);