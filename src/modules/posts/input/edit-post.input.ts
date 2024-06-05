import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class EditPostInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;
}
