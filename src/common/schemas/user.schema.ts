import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({
  timestamps: true
})
export class User {
  @Prop({ unique: true, required: true, index: true })
  email: string

  @Prop({ required: true, select: false })
  passwordHash: string

  @Prop({ required: true })
  role!: string

  @Prop({ default: false })
  superAdmin: boolean

  @Prop({ default: true })
  active: boolean

  @Prop()
  name?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
