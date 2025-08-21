import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'dev_secret',
      ignoreExpiration: false
    })
  }

  validate(payload: any) {
    return {
      sub: String(payload.sub ?? payload.id ?? payload._id),
      email: payload.email,
      roles: payload.roles ?? [],
      superAdmin: !!payload.superAdmin
    }
  }
}
