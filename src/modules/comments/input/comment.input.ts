import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommentInput {
  @Field(() => String, { nullable: true })
  postId?: string;

  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => String)
  content?: string;
}
