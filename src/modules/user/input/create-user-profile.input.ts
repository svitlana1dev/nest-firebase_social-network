import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserProfileInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  secondName?: string;

  @Field({ nullable: true })
  bio?: string;
}
