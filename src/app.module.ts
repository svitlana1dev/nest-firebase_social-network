import { Module } from '@nestjs/common';
import {
  Field,
  GraphQLModule,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';

// @ObjectType()
// class SimpleType {
//   @Field()
//   message: string;
// }

// @Resolver(() => SimpleType)
// class SimpleResolver {
//   @Query(() => SimpleType)
//   getSimpleMessage(): SimpleType {
//     return { message: 'Hello World' };
//   }
// }

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Set this manually if NODE_ENV=production
      introspection: true,
      path: '/',
      context: ({ req }) => ({
        headers: req.headers, // Include headers in the context
      }),
    }),
    AuthModule,
    UserModule,
    PostsModule,
    CommentsModule,
  ],
  // providers: [SimpleResolver],
  // controllers: [AppController],
  // providers: [AppService],
  providers: [AppResolver],
})
export class AppModule {}
