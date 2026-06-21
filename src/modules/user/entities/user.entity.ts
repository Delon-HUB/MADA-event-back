import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICreateUserDto } from '../dto/create-user.dto';
import { ERole } from '../../../Enums/ERole';

@Schema({ timestamps: true, collection: 'users' })
export class UserEntity implements ICreateUserDto {
  @Prop({ required: true })
  firstName!: string;

  @Prop()
  lastName?: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiry?: Date;

  @Prop({ required: true, default: false })
  verified!: boolean;

  @Prop({ required: true, default: ERole.CLIENT })
  role!: ERole;

  @Prop({ default: '/public/profile/default.jpeg' })
  photo?: string;

  @Prop({ required: true, default: Date.now() })
  createdAt!: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
