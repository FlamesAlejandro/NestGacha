import { NestFactory } from '@nestjs/core'
import { SeedModule } from './seed.module'
import { RolesSeeder } from './roles.seeder'
import { UsersSeeder } from './users.seeder'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule)

  const roles = app.get(RolesSeeder)
  const users = app.get(UsersSeeder)

  await roles.drop()
  await users.drop()

  await roles.seed()
  await users.seed()

  await app.close()

  console.log('✓ seed done')
}
bootstrap()
