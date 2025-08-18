import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type GachaHistoryDocument = HydratedDocument<GachaHistory>

@Schema({ timestamps: true })
export class GachaHistory {
  _id!: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  user!: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Banner', index: true, required: true })
  banner!: Types.ObjectId

  @Prop({ default: 10 }) pullsCount!: number
  @Prop({ default: 0 }) creditsSpent!: number

  // resultados de la tirada
  @Prop({
    type: {
      normal: { type: Number, default: 0 },
      rare: { type: Number, default: 0 },
      super_rare: { type: Number, default: 0 }
    },
    default: undefined
  })
  rarityRatesSnapshot?: { normal: number; rare: number; super_rare: number }
}
export const GachaHistorySchema = SchemaFactory.createForClass(GachaHistory)
