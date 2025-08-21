import { IsInt, Max, Min } from 'class-validator'

export class SeedCharactersDto {
  @IsInt()
  @Min(1)
  @Max(2000)
  animeId!: number
}
