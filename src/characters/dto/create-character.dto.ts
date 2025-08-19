import { CharacterRarityEnum, CharacterStateEnum } from '@common/enums'
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsEnum(CharacterRarityEnum)
  rarity!: CharacterRarityEnum

  @IsEnum(CharacterStateEnum)
  state!: CharacterStateEnum
}
