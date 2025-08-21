import { CharacterRarityEnum } from '@common/enums'
import {
  GachaExchange,
  GachaExchangeDocument,
  GachaHistory,
  GachaHistoryDocument
} from '@common/schemas'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, startSession, Types } from 'mongoose'
import { PickedCharacter } from 'src/characters/interfaces/picked-characters.interface'

export type PullCommitInput = {
  userId: string
  bannerId: string
  pulls: number
  byRarity: Record<CharacterRarityEnum, number>
  charactersFromGacha: PickedCharacter[]
}

@Injectable()
export class GachaTransactionalService {
  constructor(
    @InjectModel(GachaExchange.name)
    private readonly exchangeModel: Model<GachaExchangeDocument>,
    @InjectModel(GachaHistory.name)
    private readonly historyModel: Model<GachaHistoryDocument>
  ) {}

  async commitPull({
    userId,
    bannerId,
    pulls,
    byRarity,
    charactersFromGacha
  }: PullCommitInput): Promise<void> {
    const session = await startSession()
    try {
      await session.withTransaction(async () => {
        // operador inc de incremento
        const inc: Record<string, number> = {
          [`pityByBanner.${bannerId}`]: pulls
        }
        inc['exchangeCounters.normal'] =
          byRarity[CharacterRarityEnum.Normal] ?? 0
        inc['exchangeCounters.rare'] = byRarity[CharacterRarityEnum.Rare] ?? 0
        inc['exchangeCounters.sr'] =
          byRarity[CharacterRarityEnum.SuperRare] ?? 0
        inc['exchangeCounters.ssr'] =
          byRarity[CharacterRarityEnum.SuperSuperRare] ?? 0

        // buscamos para actualizar o crear con upsert
        await this.exchangeModel.updateOne(
          { user: new Types.ObjectId(userId) },
          { $inc: inc },
          { upsert: true, session }
        )

        // guardar los resultados del pull en el historial
        await this.historyModel.create(
          [
            {
              user: new Types.ObjectId(userId),
              banner: new Types.ObjectId(bannerId),
              pullsCount: pulls,
              items: charactersFromGacha.map((c) => ({
                characterId: new Types.ObjectId(c._id),
                name: c.name,
                rarity: c.rarity,
                imageUrl: c.imageUrl ?? ''
              }))
            }
          ],
          { session }
        )
      })
    } finally {
      session.endSession()
    }
  }
}
