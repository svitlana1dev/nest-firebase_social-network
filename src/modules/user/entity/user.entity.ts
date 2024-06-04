import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from '../../posts/entity/post.entity';

@ObjectType()
export class User {
  @Field(() => String)
  uid: string;

  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL?: string;
}

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field(() => String, { nullable: true })
  photoURL?: string;

  @Field(() => String, { nullable: true })
  secondName?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
