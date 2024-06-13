import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { CommentInput } from '../input/comment.input';
import { FieldValue } from 'firebase-admin/firestore';
import { formatDate } from '../../../utils/formate-date.utils';

@Injectable()
export class CommentsService {
  private db: any;
  private postCollectionGroup: any;
  private commentCollectionGroup: any;
  private createdAt: FieldValue;

  constructor() {
    this.db = admin.firestore();
    this.postCollectionGroup = this.db.collectionGroup('posts');
    this.commentCollectionGroup = this.db.collectionGroup('comments');
    this.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }

  async addComment(user: any, input: CommentInput) {
    let postRef;

    await this.postCollectionGroup
      .where('id', '==', input.postId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          postRef = doc.ref;
        });
      });

    const commentRef = postRef.collection('comments').doc();

    try {
      await commentRef.set({
        id: commentRef.id,
        authorUid: user.uid,
        authorName: user.name,
        createdAt: this.createdAt,
        authorPhoto: user?.picture,
        ...input,
      });
      const commentDoc = await commentRef.get();

      const createdDate = formatDate(commentDoc, 'createdAt');

      return {
        ...commentDoc.data(),
        createdAt: createdDate,
      };
    } catch (err) {
      throw new HttpException(
        `Comment didn't create: ${err}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getComments(postId) {
    let postRef;
    const querySnapshot = await this.db
      .collectionGroup('posts')
      .where('id', '==', postId)
      .get();

    const comments = [];

    for (let query of querySnapshot.docs) {
      postRef = query.ref;
      const commentsRef = await query.ref.collection('comments').get();

      for (let comment of commentsRef.docs) {
        const createdAt = formatDate(comment, 'createdAt');
        const updatedAt = formatDate(comment, 'updatedAt');

        const answers = await comment.ref.collection('comments').get();
        const answersCount = answers.size;
        const allAnswers = [];
        for (let answer of answers.docs) {
          const createdAt = formatDate(comment, 'createdAt');
          const updatedAt = formatDate(comment, 'updatedAt');
          allAnswers.push({ ...answer.data(), createdAt, updatedAt });
        }

        comments.push({
          ...comment.data(),
          createdAt,
          updatedAt,
          answersCount,
          allAnswers,
        });
      }
    }
    return comments;
  }

  async editComment(uid: string, postInput: CommentInput) {
    const updatedAt = admin.firestore.FieldValue.serverTimestamp();

    try {
      const querySnapshot = await this.commentCollectionGroup
        .where('id', '==', postInput.commentId)
        .where('authorUid', '==', uid)
        .get();

      querySnapshot.forEach((doc) => {
        doc.ref.update({
          content: postInput.content,
          updatedAt,
        });
      });

      return 'Comment successfully update';
    } catch (err) {
      throw new HttpException(
        `Comment didn't update: ${err}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteComment(uid: string, commentId: String) {
    try {
      await this.commentCollectionGroup
        .where('id', '==', commentId)
        .where('authorUid', '==', uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });

      return 'Comment successfully deleted';
    } catch (err) {
      throw new HttpException(
        `Comment didn't delete: ${err}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async replyToComment(user: any, input: CommentInput) {
    let postRef;

    await this.postCollectionGroup
      .where('id', '==', input.postId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          postRef = doc.ref;
        });
      });

    const replyCommentRef = postRef
      .collection('comments')
      .doc(input.commentId)
      .collection('comments')
      .doc();

    try {
      await replyCommentRef.set({
        id: replyCommentRef.id,
        authorUid: user.uid,
        authorName: user.name,
        createdAt: this.createdAt,
        authorPhoto: user?.picture,
        ...input,
      });
      const commentDoc = await replyCommentRef.get();

      const createdDate = formatDate(commentDoc, 'createdAt');
      return {
        ...commentDoc.data(),
        createdAt: createdDate,
      };
    } catch (err) {
      console.error(`Comment didn't create: ${err}`);
    }
  }
}
