import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import { CommentsResolver } from './resolvers/comments.resolver';

@Module({
  controllers: [],
  providers: [CommentsService, CommentsResolver],
})
export class CommentsModule {}
