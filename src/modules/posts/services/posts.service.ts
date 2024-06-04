import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { CreatePostInput } from '../input/create-post.input';
import { EditPostInput } from '../input/edit-post.input';
import { formatDate } from '../../../utils/formate-date.utils';
import { countDocumentsInCollection } from '../../../utils/count-doc-collection.utils';

@Injectable()
export class PostsService {
  private db: any;
  private postCollectionGroup: any;

  constructor() {
    this.db = admin.firestore();
    this.postCollectionGroup = this.db.collectionGroup('posts');
  }

  async createPost(user: any, postInput: CreatePostInput) {
    const postRef = this.db
      .collection('users')
      .doc(user.uid)
      .collection('posts')
      .doc();

    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    try {
      await postRef.set({
        id: postRef.id,
        authorUid: user.uid,
        authorName: user.name,
        createdAt,
        // authorPhoto: user.photoURL,
        ...postInput,
      });
      const postDoc = await postRef.get();
      const createdDate = formatDate(postDoc, 'createdAt');

      return {
        ...postDoc.data(),
        createdAt: createdDate,
      };
    } catch (err) {
      throw new HttpException(
        `Post didn't create: ${err}`,
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async getPostById(postId: string) {
    let postRef;
    let postData;
    const querySnapshot = await this.postCollectionGroup
      .where('id', '==', postId)
      .get();

    let post;
    querySnapshot.forEach((doc) => {
      const createdAt = formatDate(doc, 'createdAt');
      const updatedAt = formatDate(doc, 'updatedAt');

      postRef = doc.ref;

      post = {
        ...doc.data(),
        createdAt,
        updatedAt,
      };
    });

    const collectionRef = await postRef.collection('comments');
    const commentsCount = await countDocumentsInCollection(collectionRef);

    postData = {
      ...post,
      commentsCount,
    };

    return { postRef, postData };
  }

  async getAllPosts(querySearch: string, limit: number, offset: number) {
    const collectionGroup = await this.postCollectionGroup;
    const posts = await collectionGroup
      // .orderBy('createdAt')
      // .orderBy('like')
      .where('description', '>=', querySearch)
      .where('description', '<=', querySearch + '\uf8ff')
      .limit(limit)
      .offset(offset)
      .get();

    const postArr = [];

    for (const post of posts.docs) {
      const collectionRef = await post.ref.collection('comments');
      const commentsCount = await countDocumentsInCollection(collectionRef);

      const createdAt = formatDate(post, 'createdAt');
      const updatedAt = formatDate(post, 'updatedAt');

      postArr.push({
        id: post.id,
        ...post.data(),
        commentsCount,
        createdAt,
        updatedAt,
      });
    }

    return {
      posts: postArr,
    };
  }

  async editPost(uid: string, postInput: EditPostInput) {
    const updatedAt = admin.firestore.FieldValue.serverTimestamp();

    try {
      const postRef = await this.db
        .collection('users')
        .doc(uid)
        .collection('posts')
        .doc(postInput.id);

      await postRef.update({
        title: postInput.title,
        description: postInput.description,
        updatedAt,
      });

      const postDoc = await postRef.get();

      const updatedDate = formatDate(postDoc, 'updatedAt');

      return {
        id: postRef.id,
        ...postDoc.data(),
        updatedAt: updatedDate,
      };
    } catch (err) {
      throw new HttpException(
        `Post didn't update: ${err}`,
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async deletePost(uid: string, postId: string) {
    try {
      await this.db
        .collection('users')
        .doc(uid)
        .collection('posts')
        .doc(postId)
        .delete();

      return { id: postId };
    } catch (err) {
      throw new HttpException(
        `Post didn't delete: ${err}`,
        HttpStatus.NOT_MODIFIED,
      );
    }
  }
}
