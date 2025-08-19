import { PartialType } from '@nestjs/mapped-types'
import { CreateCharacterDto } from './create-character.dto'
import { IsMongoId } from 'class-validator'

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {
  @IsMongoId()
  _id?: string
}
