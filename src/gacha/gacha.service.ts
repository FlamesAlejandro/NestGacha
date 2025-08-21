import { CharacterRarityEnum, CharacterStateEnum } from '@common/enums'
import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { FullPullDto } from './dtos/Pull.dto'
import { BannersService } from 'src/banners/banners.service'
import { getRatesByBannerType, rollRarity } from './utils/pull-rates.util'
import { CharactersService } from 'src/characters/characters.service'
import { GachaTransactionalService } from './gacha.transactional'
import { PickedCharacter } from 'src/characters/interfaces/picked-characters.interface'

@Injectable()
export class GachaService {
  private readonly _logger = new Logger('GachaService')
  constructor(
    @InjectQueue('gacha') private readonly gachaQueue: Queue,
    private readonly bannerService: BannersService,
    private readonly characterService: CharactersService,
    private readonly gachaTransactional: GachaTransactionalService
  ) {}

  async createQueue(dto: FullPullDto): Promise<any> {
    try {
      //cola de Bull
      await this.gachaQueue.add('processGacha', dto, {
        attempts: 3, // Reintentar 3 veces si falla
        backoff: 5000, // Esperar 5 segundos entre intentos
        removeOnComplete: true
      })
    } catch (error) {
      throw new Error('Error añadiendo el pull a la cola' + error)
    }
  }

  async handlePullRequest(job: FullPullDto): Promise<any> {
    try {
      const { userId, bannerId, pulls } = job
      // obtener la banner
      const banner = await this.bannerService.findOne(bannerId)
      if (!banner) throw new Error('Banner no encontrado')

      // obtener las tasas de la banner
      const rates = getRatesByBannerType(banner.type)

      // record que va almacenar los resultados por rareza
      const byRarity: Record<CharacterRarityEnum, number> = {
        [CharacterRarityEnum.Normal]: 0,
        [CharacterRarityEnum.Rare]: 0,
        [CharacterRarityEnum.SuperRare]: 0,
        [CharacterRarityEnum.SuperSuperRare]: 0
      }
      // simular el pull
      for (let i = 0; i < pulls; i++) {
        const rarity = rollRarity(rates)
        byRarity[rarity]++
      }
      // obtener personajes por rareza
      const charactersFromGacha: PickedCharacter[] =
        await this.characterService.pickManyGrouped(
          byRarity,
          CharacterStateEnum.Standard
        )
      // commit transaccional
      await this.gachaTransactional.commitPull({
        userId,
        bannerId,
        pulls,
        byRarity,
        charactersFromGacha
      })
      return { charactersGranted: charactersFromGacha }
    } catch (error) {
      throw new Error('Error procesando el pull' + error)
    }
  }
}
