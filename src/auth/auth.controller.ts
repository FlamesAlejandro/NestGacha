// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from './dtos/auth.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { AuthUser, JwtPayload } from './auth-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@AuthUser() user: JwtPayload) {
    return { id: user.sub, email: user.email }
  }
}
