import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostsService } from './posts.service';

@Injectable()
export class ReactionService {
  constructor(private readonly postsService: PostsService) {}

  async addReaction(
    key: string,
    oppositeKey: string,
    userId: string,
    postId: string,
  ) {
    const { postRef, postData } = await this.postsService.getPostById(postId);

    if (postData[oppositeKey] && postData[oppositeKey].includes(userId)) {
      await postRef.update({
        [oppositeKey]: postData[oppositeKey].filter((id) => id !== userId),
      });
    }

    if (postData[key] && postData[key].includes(userId)) {
      await postRef.update({
        [key]: postData[key].filter((id) => id !== userId),
      });
    } else {
      await postRef.update({
        [key]: postData[key] ? [userId, ...postData?.[key]] : [userId],
      });
    }

    return postData.id;
  }

  async likedPost(userId: string, postId: string) {
    try {
      const result = await this.addReaction('like', 'dislike', userId, postId);

      return result;
    } catch (err) {
      throw new HttpException(`Error likedPost:${err}`, HttpStatus.NOT_FOUND);
    }
  }

  async dislikedPost(userId: string, postId: string) {
    try {
      const result = await this.addReaction('dislike', 'like', userId, postId);

      return result;
    } catch (err) {
      throw new HttpException(
        `Error dislikedPost: ${err}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
