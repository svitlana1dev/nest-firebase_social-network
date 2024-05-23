import { Controller, Get, UseGuards } from '@nestjs/common';
import admin from 'firebase-admin';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    // const db = admin.firestore();

    // try {
    // const collections = await db.listCollections();
    // console.log('collections');
    // console.log(collections);
    //   collections.forEach((collection) => {
    //     console.log('Collection ID:', collection.id);
    //   });
    // } catch (error) {
    //   console.error('Error listing collections:', error);
    // }
    return this.appService.getHello();
  }

  // @Get('users')
  // async getUsers(): Promise<any> {
  //   let users;

  //   // try {
  //   const listUsersResult = await admin.auth().listUsers();
  //   users = listUsersResult.users;
  //   listUsersResult.users.forEach((userRecord) => {
  //     console.log('User ID:', userRecord.uid);
  //   });
  //   // } catch (error) {
  //   //   console.error('Error listing users:', error);
  //   // }

  //   return users;
  // }

  // get one user
  // @Get('user')
  // async getUserById(): Promise<any> {
  //   const userRecord = await admin
  //     .auth()
  //     .getUser('zJEqwtL74NQ8e4X0tdWvvgxCisD3');

  //   return userRecord;
  // }
}
