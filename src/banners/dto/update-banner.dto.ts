import { PartialType } from '@nestjs/mapped-types'
import { CreateBannerDto } from './create-banner.dto'
import { IsMongoId } from 'class-validator'

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  @IsMongoId()
  _id?: string
}
