import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type GachaExchangeDocument = HydratedDocument<GachaExchange>

@Schema({ timestamps: true })
export class GachaExchange {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    unique: true,
    index: true,
    required: true
  })
  user!: Types.ObjectId

  // pity acumulado por banner
  @Prop({ type: Map, of: Number, default: new Map<string, number>() })
  pityByBanner!: Map<string, number>

  // contador exchange
  @Prop({
    type: {
      normal: { type: Number, default: 0 },
      rare: { type: Number, default: 0 },
      sr: { type: Number, default: 0 },
      ssr: { type: Number, default: 0 }
    },
    default: { normal: 0, rare: 0, sr: 0, ssr: 0 }
  })
  exchangeCounters!: Record<'normal' | 'rare' | 'sr' | 'ssr', number>
}

export const GachaExchangeSchema = SchemaFactory.createForClass(GachaExchange)

GachaExchangeSchema.index({ user: 1 }, { unique: true })
