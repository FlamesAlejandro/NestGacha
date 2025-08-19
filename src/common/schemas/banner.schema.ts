import { BannerTypeEnum } from '@common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type BannerDocument = HydratedDocument<Banner>

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  startDate!: Date

  @Prop({ required: true, enum: Object.values(BannerTypeEnum) })
  type!: BannerTypeEnum

  @Prop({ required: true })
  endDate!: Date

  // identificar personaje del pity
  @Prop({ type: Types.ObjectId, ref: 'Character', required: true })
  pityTargetCharacter!: Types.ObjectId
}
export const BannerSchema = SchemaFactory.createForClass(Banner)
