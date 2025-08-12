import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type JwtPayload = {
  sub: string
  email: string
  roles: string[]
  superAdmin?: boolean
}

export const AuthUser = createParamDecorator<
  keyof JwtPayload | undefined,
  ExecutionContext
>((key, ctx) => {
  const req = ctx.switchToHttp().getRequest()
  const user = req.user as JwtPayload | undefined
  return key ? (user as any)?.[key] : user
})
