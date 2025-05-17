import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Role } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.userModel.countDocuments();
    if (count > 0) return;

    /* 회원가입(create)에 ROLE 없으니 직접 추가*/
    const users = [
      { email: 'maple_admin@maple.com', password: '1234', role: Role.ADMIN },
      { email: 'maple_operator@maple.com', password: '1234', role: Role.OPERATOR },
      { email: 'maple_auditor@maple.com', password: '1234', role: Role.AUDITOR },
      { email: 'amaple_user@maple.com', password: '1234', role: Role.USER },
    ];

    for (const { email, password, role } of users) {
      const hashed = await bcrypt.hash(password, 10);
      await this.userModel.create({ email, password: hashed, role });
      console.log(`created ${role} - ${email}`);
    }
  }
}
