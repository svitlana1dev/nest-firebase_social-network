import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field(() => String)
  id: string;

  @Field(() => String)
  authorUid: string;

  @Field(() => String, { nullable: true })
  authorName: string;

  @Field(() => String, { nullable: true })
  authorPhoto?: string;

  @Field(() => String)
  content: string;

  @Field(() => String)
  commentId?: string;

  @Field(() => String)
  postId?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Number, { nullable: true })
  answersCount?: number;

  @Field(() => [Comment], { nullable: true })
  allAnswers: Comment[];
}
