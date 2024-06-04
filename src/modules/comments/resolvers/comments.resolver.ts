import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CommentsService } from '../services/comments.service';
import { Comment } from '../entity/comment.entity';
import { CommentInput } from '../input/comment.input';

@UseGuards(GqlAuthGuard)
@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  async addComment(
    @CurrentUser() user: any,
    @Args('input') input: CommentInput,
  ) {
    return this.commentsService.addComment(user, input);
  }

  @Query(() => [Comment])
  async getComments(@Args('postId') postId: String) {
    return this.commentsService.getComments(postId);
  }

  @Mutation(() => String)
  async deleteComment(
    @CurrentUser() user: any,
    @Args('commentId') commentId: string,
  ) {
    return this.commentsService.deleteComment(user.uid, commentId);
  }

  @Mutation(() => String)
  async editComment(
    @CurrentUser() user: any,
    @Args('postInput') postInput: CommentInput,
  ) {
    return this.commentsService.editComment(user.uid, postInput);
  }

  @Mutation(() => Comment)
  async replyToComment(
    @CurrentUser() user: any,
    @Args('postInput') postInput: CommentInput,
  ) {
    return this.commentsService.replyToComment(user, postInput);
  }
}
