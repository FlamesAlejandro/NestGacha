import { BannerTypeEnum } from '@common/enums'
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsMongoId
} from 'class-validator'

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsDateString()
  startDate!: string

  @IsDateString()
  endDate!: string

  @IsEnum(BannerTypeEnum)
  type!: BannerTypeEnum

  @IsMongoId()
  pityTargetCharacter!: string
}
