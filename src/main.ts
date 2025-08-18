import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  )
  const port = Number(process.env.PORT) || 3001
  await app.listen(port)
  console.log(`🚀 Server running on http://localhost:${port}`)
}
bootstrap()
