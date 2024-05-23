// import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UserProfileDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  secondName: string;

  @IsString()
  @IsOptional()
  photoURL: string;

  @IsString()
  @IsOptional()
  bio: string;

  //   @IsArray()
  //   @IsOptional()
  //   //   @ValidateNested({ each: true })
  //   //   @Type(() => string)
  //   posts: string[];
}
