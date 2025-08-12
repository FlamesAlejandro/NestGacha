import { Injectable, ExecutionContext } from '@nestjs/common'
import { ACGuard } from 'nest-access-control'

@Injectable()
export class SuperACGuard extends ACGuard {
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    if (req.user?.superAdmin === true) return true
    if (Array.isArray(req.user?.roles) && req.user.roles.includes('superAdmin'))
      return true
    return super.canActivate(ctx)
  }
}
