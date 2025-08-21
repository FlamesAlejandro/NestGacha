import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class SeedCharactersDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  animeId!: number
}
