import { Module } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { CharactersController } from './characters.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { RbacModule } from '@access/rbac.module'
import { Character, CharacterSchema } from '@common/schemas'
import { CharacterFactory } from './factories/characters.factory'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema }
    ]),
    RbacModule
  ],
  controllers: [CharactersController],
  providers: [CharactersService, CharacterFactory],
  exports: [CharactersService]
})
export class CharactersModule {}
