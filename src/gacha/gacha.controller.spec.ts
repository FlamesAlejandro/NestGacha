import { Test, TestingModule } from '@nestjs/testing'
import { GachaController } from './gacha.controller'
import { GachaService } from './gacha.service'

describe('GachaController', () => {
  let controller: GachaController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GachaController],
      providers: [GachaService]
    }).compile()

    controller = module.get<GachaController>(GachaController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
