import { Injectable } from '@nestjs/common'
import { CharacterRarityEnum, CharacterStateEnum } from '@common/enums'
import { ICharacter } from '@common/schemas'
import {
  JikanAnimeCharacterItem,
  JikanImageSet
} from '../interfaces/jikan.interface'

@Injectable()
export class CharacterFactory {
  normalizeName(raw: string): string {
    if (!raw) return ''
    const parts = raw.split(',').map((s) => s.trim())
    const fixed = parts.length === 2 ? `${parts[1]} ${parts[0]}` : raw
    return fixed.toLowerCase()
  }

  getDefaultDistribution(): CharacterRarityEnum[] {
    const base: CharacterRarityEnum[] = [
      ...Array(10).fill(CharacterRarityEnum.Normal),
      ...Array(6).fill(CharacterRarityEnum.Rare),
      ...Array(3).fill(CharacterRarityEnum.SuperRare),
      ...Array(1).fill(CharacterRarityEnum.SuperSuperRare)
    ]
    return base
  }

  private pickImageUrl(images?: JikanImageSet): string | undefined {
    return (
      images?.jpg?.image_url ??
      images?.webp?.image_url ??
      images?.webp?.small_image_url ??
      undefined
    )
  }

  mapCharactersToCreate(
    chosen: JikanAnimeCharacterItem[],
    rarities: CharacterRarityEnum[]
  ): Partial<ICharacter>[] {
    if (chosen.length !== rarities.length) {
      throw new Error('Chosen characters and rarities length mismatch')
    }

    const docs = chosen.map((entry, idx) => {
      const ch = entry.character
      const name = this.normalizeName(ch?.name ?? '')
      const imageUrl = this.pickImageUrl(ch?.images)

      return {
        name,
        rarity: rarities[idx],
        state: CharacterStateEnum.Standard,
        imageUrl
      } as Partial<ICharacter>
    })
    return docs
  }
}
