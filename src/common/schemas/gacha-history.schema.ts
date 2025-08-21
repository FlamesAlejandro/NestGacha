import { CharacterRarityEnum } from '@common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type GachaHistoryDocument = HydratedDocument<GachaHistory>

@Schema({ timestamps: true })
export class GachaHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  user!: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Banner', index: true, required: true })
  banner!: Types.ObjectId

  @Prop({ type: Number, min: 1, default: 10 })
  pullsCount!: number

  @Prop({
    type: [
      {
        _id: false,
        characterId: { type: Types.ObjectId, ref: 'Character', required: true },
        name: { type: String, required: true },
        rarity: {
          type: String,
          enum: Object.values(CharacterRarityEnum),
          required: true
        },
        imageUrl: { type: String, required: true }
      }
    ],
    required: true
  })
  items!: {
    characterId: Types.ObjectId
    name: string
    rarity: CharacterRarityEnum
    imageUrl: string
  }[]
}

export const GachaHistorySchema = SchemaFactory.createForClass(GachaHistory)

GachaHistorySchema.index({ user: 1, banner: 1, createdAt: -1 })
GachaHistorySchema.index({ user: 1, createdAt: -1 })
