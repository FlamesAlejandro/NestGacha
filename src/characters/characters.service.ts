import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Character, CharacterDocument } from '@common/schemas'
import { Model } from 'mongoose'
import { CharacterRarityEnum, CharacterStateEnum } from '@common/enums'
import { SeedCharactersDto } from './dto/seed-character.dto'
import axios from 'axios'
import { CharacterFactory } from './factories/characters.factory'
import { JikanAnimeCharacterItem } from './interfaces/jikan.interface'
import { PickedCharacter } from './interfaces/picked-characters.interface'

@Injectable()
export class CharactersService {
  private readonly logger = new Logger(CharactersService.name)
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
    private readonly characterFactory: CharacterFactory
  ) {}

  async create(createCharacterDto: CreateCharacterDto) {
    return await this.characterModel.create(createCharacterDto)
  }

  async findAll() {
    return this.characterModel.find()
  }

  async findOne(id: number) {
    return this.characterModel.findById(id).exec()
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return await this.characterModel
      .findByIdAndUpdate(id, { $set: updateCharacterDto }, { new: true })
      .exec()
  }

  async remove(id: number) {
    const doc = await this.characterModel.findByIdAndDelete(id).exec()
    if (!doc) throw new NotFoundException('Personaje no encontrado')
    return doc
  }

  async pickManyGrouped(
    needs: Record<CharacterRarityEnum, number>,
    state?: CharacterStateEnum
  ): Promise<PickedCharacter[]> {
    try {
      const pickedChars: PickedCharacter[] = []

      for (const rarity of Object.keys(needs) as CharacterRarityEnum[]) {
        const n = needs[rarity] || 0
        if (n <= 0) continue

        const match: Record<string, any> = { rarity }
        if (state) match.state = state

        const docs = await this.characterModel.aggregate<PickedCharacter>([
          { $match: match },
          { $sample: { size: n } },
          {
            $project: {
              _id: { $toString: '$_id' },
              name: 1,
              rarity: 1,
              imageUrl: 1
            }
          }
        ])

        // Si no hay suficientes personajes, repetir
        while (docs.length < n && docs.length > 0) {
          docs.push(docs[Math.floor(Math.random() * docs.length)])
        }

        pickedChars.push(...docs.slice(0, n))
      }

      return pickedChars
    } catch (error) {
      this.logger.error('Error picking characters', error)
      throw new Error('Error picking characters: ' + error.message)
    }
  }

  async importFromAnime(dto: SeedCharactersDto) {
    const { animeId } = dto

    try {
      const url = `https://api.jikan.moe/v4/anime/${animeId}/characters`
      const { data } = await axios.get(url)
      const items = (data?.data ?? []) as JikanAnimeCharacterItem[]

      if (!items.length)
        throw new NotFoundException(
          'No se encontraron personajes para ese anime'
        )

      const chosen = items.slice(0, 20)

      const rarities = this.characterFactory.getDefaultDistribution(20)
      const docs = this.characterFactory.mapCharactersToCreate(chosen, rarities)
      const inserted = await this.characterModel.insertMany(docs, {
        ordered: false
      })
      return { inserted: inserted.length, items: inserted }
    } catch (error) {
      this.logger.error('Error importing characters', error)
      throw error
    }
  }
}
