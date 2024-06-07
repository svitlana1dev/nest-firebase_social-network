import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import admin from 'firebase-admin';

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = { ...ctx.getContext().req.user };
    console.log('user.name');
    console.log(user);
    console.log('user.name');
    if (!user.hasOwnProperty('name')) {
      try {
        const authUser = await admin
          .auth()
          .getUser(ctx.getContext().req.user.uid);
        user.name = authUser.displayName;
      } catch (err) {}
    }
    return user;
  },
);
