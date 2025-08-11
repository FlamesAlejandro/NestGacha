// src/access/role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Action } from '../enums'

export type RoleDocument = HydratedDocument<Role>

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  key: string
  @Prop()
  label: string

  @Prop({
    type: [
      {
        module: { type: String, required: true },
        actions: [{ type: String, enum: Object.values(Action), default: [] }]
      }
    ],
    default: []
  })
  moduleGrants: { module: string; actions: Action[] }[]
}
export const RoleSchema = SchemaFactory.createForClass(Role)
