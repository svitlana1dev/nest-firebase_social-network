import { Controller, Get, UseGuards } from '@nestjs/common';
import admin from 'firebase-admin';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
