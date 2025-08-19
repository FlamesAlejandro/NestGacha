import { Module } from '@nestjs/common'
import { BannersService } from './banners.service'
import { BannersController } from './banners.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Banner, BannerSchema } from '@common/schemas'
import { RbacModule } from '@access/rbac.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    RbacModule
  ],
  controllers: [BannersController],
  providers: [BannersService],
  exports: [BannersService]
})
export class BannersModule {}
