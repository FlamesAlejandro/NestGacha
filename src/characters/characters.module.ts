import { Module } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { CharactersController } from './characters.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { RbacModule } from '@access/rbac.module'
import { Character, CharacterSchema } from '@common/schemas'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema }
    ]),
    RbacModule
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService]
})
export class CharactersModule {}
