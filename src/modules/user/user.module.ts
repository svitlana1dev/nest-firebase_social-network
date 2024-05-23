import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  controllers: [],
  providers: [UserService, UserResolver],
})
export class UserModule {}
