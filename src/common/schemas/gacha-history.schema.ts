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

  // resultados por rareza
  @Prop({
    type: [
      {
        _id: false,
        rarity: {
          type: String,
          enum: Object.values(CharacterRarityEnum),
          required: true
        },
        count: { type: Number, min: 0, required: true }
      }
    ],
    default: []
  })
  results!: { rarity: CharacterRarityEnum; count: number }[]
}

export const GachaHistorySchema = SchemaFactory.createForClass(GachaHistory)

GachaHistorySchema.index({ user: 1, createdAt: -1 })
GachaHistorySchema.index({ banner: 1, createdAt: -1 })
