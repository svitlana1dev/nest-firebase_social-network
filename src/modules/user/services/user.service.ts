import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { REQUEST } from '@nestjs/core';
import { CreateUserProfileDto } from '../dtos/create-user-profile.dto';
// import DocumentSnapshot = firestore.DocumentSnapshot;
// import QuerySnapshot = firestore.QuerySnapshot;

@Injectable()
export class UserService {
  private db: any;

  constructor(@Inject(REQUEST) private readonly request: { user: any }) {
    this.db = admin.firestore();
  }

  async createProfile(
    token: string,
    createUserProfileDto: CreateUserProfileDto,
  ) {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const collectionRef = this.db.collection('users');
    const doc = await collectionRef.doc(decodedToken.uid).get();

    if (doc.exists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    try {
      await collectionRef.doc(decodedToken.uid).set(createUserProfileDto);

      const userDoc = await collectionRef.doc(decodedToken.uid).get();
      const authUser = await admin.auth().getUser(decodedToken.uid);
      const userData = {
        firstName: authUser.displayName,
        photoURL: authUser.photoURL,
        ...userDoc.data(),
      };
      return userData;
    } catch (err) {
      console.error(`User didn't create: ${err}`);
    }
  }

  async getProfile(id: string) {
    const collectionRef = this.db.collection('users');
    const doc = await collectionRef.doc(id).get();

    if (doc.exists) {
      const user = await admin.auth().getUser(id);
      const userData = {
        // id: doc.id,
        firstName: user.displayName,
        photoURL: user.photoURL,
        ...doc.data(),
      };
      return userData;
    } else {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
  }

  async editProfile(token: string, createUserProfileDto: CreateUserProfileDto) {
    const decodedToken = await admin.auth().verifyIdToken(token);

    try {
      const collectionRef = this.db.collection('users');
      await collectionRef.doc(decodedToken.uid).update(createUserProfileDto);

      const userDoc = await collectionRef.doc(decodedToken.uid).get();
      const authUser = await admin.auth().getUser(decodedToken.uid);
      const userData = {
        firstName: authUser.displayName,
        photoURL: authUser.photoURL,
        ...userDoc.data(),
      };
      return userData;
    } catch (err) {
      console.error(`User didn't update: ${err}`);
    }
  }

  async deleteUser(token: string) {
    const decodedToken = await admin.auth().verifyIdToken(token);

    try {
      const collectionRef = this.db.collection('users');
      await admin.auth().deleteUser(decodedToken.uid);
      await collectionRef.doc(decodedToken.uid).delete();

      return 'Successfully deleted user';
    } catch (err) {
      console.error(`User didn't delete: ${err}`);
    }
  }

  //   async getUsers() {
  //     let users = [];

  //     const listUsersResult = await admin.auth().listUsers();
  //     users = listUsersResult.users;
  //     listUsersResult.users.forEach((userRecord) => {
  //       console.log('User:', userRecord.toJSON());
  //     });

  //     return users;
  //   }
}
