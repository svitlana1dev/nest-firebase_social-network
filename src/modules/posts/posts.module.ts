import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsResolver } from './resolvers/posts.resolver';
import { ReactionService } from './services/reaction.service';

@Module({
  controllers: [],
  providers: [PostsService, ReactionService, PostsResolver],
})
export class PostsModule {}
