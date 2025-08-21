import { CharacterRarityEnum } from '@common/enums'

export type PickedCharacter = {
  _id: string
  name: string
  imageUrl?: string
  rarity: CharacterRarityEnum
}
