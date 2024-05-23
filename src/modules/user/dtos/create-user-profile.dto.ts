// import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  @IsOptional()
  secondName: string;

  @IsString()
  @IsOptional()
  bio: string;

  //   @IsArray()
  //   @IsOptional()
  //   //   @ValidateNested({ each: true })
  //   //   @Type(() => string)
  //   posts: string[];
}
