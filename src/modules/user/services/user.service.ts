import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { CreateUserProfileInput } from '../input/create-user-profile.input';
import { formatDate } from '../../../utils/formate-date.utils';
import { countDocumentsInCollection } from '../../../utils/count-doc-collection.utils';

@Injectable()
export class UserService {
  private db: any;
  private collectionRef: any;

  constructor() {
    this.db = admin.firestore();
    this.collectionRef = this.db.collection('users');
  }

  async createProfile(
    uid: string,
    createUserProfileInput: CreateUserProfileInput,
  ) {
    const doc = await this.collectionRef.doc(uid).get();

    if (doc.exists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    try {
      await this.collectionRef.doc(uid).set(createUserProfileInput);

      const userDoc = await this.collectionRef.doc(uid).get();
      const authUser = await admin.auth().getUser(uid);
      const userData = {
        id: userDoc.id,
        firstName: authUser.displayName,
        photoURL: authUser.photoURL,
        ...userDoc.data(),
      };

      return userData;
    } catch (err) {
      throw new HttpException(
        `User didn't create: ${err}`,
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async getProfile(id: string) {
    const doc = await this.collectionRef.doc(id).get();

    if (doc.exists) {
      const user = await admin.auth().getUser(id);
      // not work Ok with can not get in time count of comments
      const postsRef = await doc.ref.collection('posts').get();

      const posts = [];
      // await postsRef.forEach(async (post) => {
      for (const post of postsRef.docs) {
        const collectionRef = await post.ref.collection('comments');
        const commentsCount = await countDocumentsInCollection(collectionRef);

        const createdAt = formatDate(post, 'createdAt');
        const updatedAt = formatDate(post, 'updatedAt');

        posts.push({
          ...post.data(),
          commentsCount,
          createdAt,
          updatedAt,
        });
      }
      // });

      const userData = {
        id: doc.id,
        firstName: user.displayName,
        photoURL: user.photoURL,
        ...doc.data(),
        posts,
      };

      return userData;
    } else {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
  }

  async editProfile(
    uid: string,
    createUserProfileInput: CreateUserProfileInput,
  ) {
    try {
      await this.collectionRef.doc(uid).update(createUserProfileInput);

      const userDoc = await this.collectionRef.doc(uid).get();
      const authUser = await admin.auth().getUser(uid);
      const userData = {
        id: userDoc.id,
        firstName: authUser.displayName,
        photoURL: authUser.photoURL,
        ...userDoc.data(),
      };

      return userData;
    } catch (err) {
      throw new HttpException(
        `User didn't update: ${err}`,
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async deleteUser(uid: string) {
    try {
      const collectionRef = this.db.collection('users');
      await admin.auth().deleteUser(uid);
      await collectionRef.doc(uid).delete();

      return 'Successfully deleted user';
    } catch (err) {
      throw new HttpException(
        `User didn't delete: ${err}`,
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async getUsers() {
    try {
      let users = [];

      const listUsersResult = await admin.auth().listUsers();

      users = listUsersResult.users;
      listUsersResult.users.forEach((userRecord) => {
        return userRecord;
      });

      return users;
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }
}
