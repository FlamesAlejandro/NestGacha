import { IsIn, IsMongoId } from 'class-validator'

export class PullDto {
  @IsMongoId()
  userId: string

  @IsMongoId()
  bannerId: string

  @IsIn([1, 10])
  pulls: number
}
