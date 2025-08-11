// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Action, RolesEfficiency } from '../enums'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, index: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({
    type: String,
    enum: Object.values(RolesEfficiency),
    default: RolesEfficiency.user
  })
  role: RolesEfficiency

  @Prop({
    type: [
      {
        module: { type: String, required: true },
        actions: [{ type: String, enum: Object.values(Action), default: [] }]
      }
    ],
    default: []
  })
  moduleGrants!: { module: string; actions: Action[] }[]

  @Prop({ default: true })
  active: boolean

  @Prop()
  name?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
