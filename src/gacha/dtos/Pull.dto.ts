import { Type } from 'class-transformer'
import { IsIn, IsMongoId } from 'class-validator'

export class PullDto {
  @IsMongoId()
  bannerId!: string

  @Type(() => Number)
  @IsIn([1, 10])
  pulls!: number
}

export type FullPullDto = PullDto & { userId: string }
