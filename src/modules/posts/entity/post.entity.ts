import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Comment } from '../../comments/entity/comment.entity';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  authorUid: string;

  @Field(() => String)
  authorName: string;

  @Field(() => String, { nullable: true })
  authorPhoto?: string;

  @Field(() => [ID], { nullable: true })
  like?: string[];

  @Field(() => [ID], { nullable: true })
  dislike?: string[];

  @Field(() => String, { nullable: true })
  photoURL?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Number, { nullable: true })
  commentsCount?: number;
}

@ObjectType()
export class Posts {
  @Field(() => [Post], { nullable: 'itemsAndList' })
  posts: Post[];
}
