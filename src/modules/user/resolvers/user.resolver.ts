import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateUserProfileInput } from '../input/create-user-profile.input';
import { UserService } from '../services/user.service';
import { UseGuards } from '@nestjs/common';
import { User, UserProfile } from '../entity/user.entity';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(GqlAuthGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserProfile)
  async createProfile(
    @CurrentUser() user: any,
    @Args('input') input: CreateUserProfileInput,
  ) {
    return this.userService.createProfile(user.uid, input);
  }

  @Query(() => UserProfile)
  async getProfile(@Args('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }

  @Mutation(() => UserProfile)
  async editProfile(
    @CurrentUser() user: any,
    @Args('input') input: CreateUserProfileInput,
  ) {
    return this.userService.editProfile(user.uid, input);
  }

  @Mutation(() => String)
  async deleteUser(@CurrentUser() user: any) {
    return this.userService.deleteUser(user.uid);
  }
}
