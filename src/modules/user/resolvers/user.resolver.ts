import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserProfileDto } from '../dtos/create-user-profile.dto';
import { UserService } from '../services/user.service';
import { Headers, Body, UnauthorizedException } from '@nestjs/common';
import { UserProfileDto } from '../dtos/user-profile.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(String)
  async author() {
    return 'hello world';
  }

  // @Mutation(() => UserProfileDto)
  // async createProfile(
  //   @Headers('authorization') authHeader: string,
  //   @Body() createUserProfileDto: CreateUserProfileDto,
  // ): Promise<any> {
  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     throw new UnauthorizedException('No bearer token found');
  //   }

  //   const token = authHeader.substring(7);

  //   return this.userService.createProfile(token, createUserProfileDto);
  // }

  // @Query()
}

// @UseGuards(AuthGuard())
// @Controller('user')
// export class UserResolver {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   createProfile(
//     @Headers('authorization') authHeader: string,
//     @Body() createUserProfileDto: CreateUserProfileDto,
//   ) {
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('No bearer token found');
//     }

//     const token = authHeader.substring(7);

//     return this.userService.createProfile(token, createUserProfileDto);
//   }

//   @Get(':id')
//   @HttpCode(HttpStatus.OK)
//   getProfile(@Param('id') id: string) {
//     return this.userService.getProfile(id);
//   }

//   @Put()
//   @HttpCode(HttpStatus.OK)
//   editProfile(
//     @Headers('authorization') authHeader: string,
//     @Body() createUserProfileDto: CreateUserProfileDto,
//   ) {
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('No bearer token found');
//     }

//     const token = authHeader.substring(7);

//     return this.userService.editProfile(token, createUserProfileDto);
//   }

//   @Delete()
//   @HttpCode(HttpStatus.OK)
//   deleteUser(@Headers('authorization') authHeader: string) {
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('No bearer token found');
//     }

//     const token = authHeader.substring(7);

//     return this.userService.deleteUser(token);
//   }
// }
