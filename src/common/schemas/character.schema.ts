import { CharacterRarityEnum, CharacterStateEnum } from '@common/enums'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CharacterDocument = HydratedDocument<Character>

@Schema({ timestamps: true })
export class Character {
  @Prop({ required: true })
  name!: string

  @Prop({
    required: true,
    type: String,
    enum: Object.values(CharacterRarityEnum),
    index: true
  })
  rarity!: CharacterRarityEnum

  @Prop({
    required: true,
    type: String,
    enum: Object.values(CharacterStateEnum),
    index: true
  })
  state!: CharacterStateEnum

  @Prop() imageUrl: string

  @Prop({ index: true }) malId?: number
}

export const CharacterSchema = SchemaFactory.createForClass(Character)
export type ICharacter = Omit<Character, 'createdAt' | 'updatedAt'>
