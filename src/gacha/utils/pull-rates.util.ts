import { BannerTypeEnum, CharacterRarityEnum } from '@common/enums'

export type Rates = Record<CharacterRarityEnum, number>

export const BASE_RATES: Rates = {
  [CharacterRarityEnum.SuperSuperRare]: 0.04,
  [CharacterRarityEnum.SuperRare]: 0.1,
  [CharacterRarityEnum.Rare]: 0.25,
  [CharacterRarityEnum.Normal]: 0.61
}

export function getRatesByBannerType(type: BannerTypeEnum): Rates {
  switch (type) {
    case BannerTypeEnum.Promoted:
      return {
        [CharacterRarityEnum.SuperSuperRare]: 0.06,
        [CharacterRarityEnum.SuperRare]: 0.12,
        [CharacterRarityEnum.Rare]: 0.25,
        [CharacterRarityEnum.Normal]: 0.57
      }
    case BannerTypeEnum.Festival:
      return {
        [CharacterRarityEnum.SuperSuperRare]: 0.1,
        [CharacterRarityEnum.SuperRare]: 0.15,
        [CharacterRarityEnum.Rare]: 0.25,
        [CharacterRarityEnum.Normal]: 0.5
      }
    default:
      return BASE_RATES
  }
}

export function rollRarity(
  rates: Rates,
  rng: () => number = Math.random
): CharacterRarityEnum {
  // Genera un número aleatorio entre 0 y 1
  const r = rng()
  let acc = 0
  for (const rarity of Object.keys(rates) as CharacterRarityEnum[]) {
    // Acumula las tasas y compara con el número aleatorio
    acc += rates[rarity]
    // Si el número aleatorio es menor que la tasa acumulada, retorna la rareza
    if (r < acc) return rarity
  }
  return CharacterRarityEnum.Normal
}
