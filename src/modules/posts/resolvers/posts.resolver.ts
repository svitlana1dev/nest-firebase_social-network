import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PostsService } from '../services/posts.service';
import { CreatePostInput } from '../input/create-post.input';
import { EditPostInput } from '../input/edit-post.input';
import { Post, Posts } from '../entity/post.entity';
import { PaginationPostInput } from '../input/pagination.input';
import { ReactionService } from '../services/reaction.service';

@UseGuards(GqlAuthGuard)
@Resolver()
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly reactionService: ReactionService,
  ) {}

  @Mutation(() => Post)
  async createPost(
    @CurrentUser() user: any,
    @Args('input') input: CreatePostInput,
  ) {
    return this.postsService.createPost(user, input);
  }

  @Query(() => Post)
  async getPostById(@Args('postId') postId: string) {
    const { postData } = await this.postsService.getPostById(postId);
    return postData;
  }

  @Query(() => Posts)
  async getAllPosts(@Args('input') input: PaginationPostInput) {
    return this.postsService.getAllPosts(
      input.querySearch,
      input.limit,
      input.offset,
    );
  }

  @Mutation(() => Post)
  async editPost(
    @CurrentUser() user: any,
    @Args('input') input: EditPostInput,
  ) {
    return this.postsService.editPost(user.uid, input);
  }

  @Mutation(() => Post)
  async deletePost(@CurrentUser() user: any, @Args('postId') postId: string) {
    return this.postsService.deletePost(user.uid, postId);
  }

  @Mutation(() => ID)
  async likedPost(@CurrentUser() user: any, @Args('postId') postId: string) {
    return this.reactionService.likedPost(user.uid, postId);
  }

  @Mutation(() => ID)
  async dislikedPost(@CurrentUser() user: any, @Args('postId') postId: string) {
    return this.reactionService.dislikedPost(user.uid, postId);
  }
}
