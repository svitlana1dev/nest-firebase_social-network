import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationPostInput {
  @Field(() => String, { nullable: true })
  querySearch?: string;

  @Field(() => Number, { nullable: true })
  limit: number;

  @Field(() => Number, { nullable: true })
  offset?: number;
}
