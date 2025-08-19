import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Banner, BannerDocument } from '@common/schemas'
import { Model } from 'mongoose'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Injectable()
export class BannersService {
  private logger = new Logger(BannersService.name)
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>
  ) {}

  async create(createCharacterDto: CreateBannerDto) {
    return await this.bannerModel.create(createCharacterDto)
  }

  async findAll() {
    return this.bannerModel.find()
  }

  async findOne(id: string) {
    return this.bannerModel
      .findById(id, { type: 1, startDate: 1, endDate: 1 })
      .lean()
      .exec()
  }

  async update(id: number, updateCharacterDto: UpdateBannerDto) {
    return await this.bannerModel
      .findByIdAndUpdate(id, { $set: updateCharacterDto }, { new: true })
      .exec()
  }

  async remove(id: number) {
    const doc = await this.bannerModel.findByIdAndDelete(id).exec()
    if (!doc) throw new NotFoundException('Banner no encontrado')
    return doc
  }
}
