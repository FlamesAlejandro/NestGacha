import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Action, ACTIONS, ModuleKey } from '../enums'

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
        module: {
          type: String,
          enum: Object.values(ModuleKey),
          required: true
        },
        actions: [{ type: String, enum: ACTIONS, default: [] }]
      }
    ],
    default: []
  })
  grants: { module: ModuleKey; actions: Action[] }[]
}
export const RoleSchema = SchemaFactory.createForClass(Role)
