import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserProfileDto } from './dtos/create-user-profile.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProfile(
    @Headers('authorization') authHeader: string,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No bearer token found');
    }

    const token = authHeader.substring(7);

    return this.userService.createProfile(token, createUserProfileDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getProfile(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  editProfile(
    @Headers('authorization') authHeader: string,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No bearer token found');
    }

    const token = authHeader.substring(7);

    return this.userService.editProfile(token, createUserProfileDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteUser(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No bearer token found');
    }

    const token = authHeader.substring(7);

    return this.userService.deleteUser(token);
  }

  //   @Get('users')
  //   getUsers() {
  //     return this.userService.getUsers();
  //   }
}
