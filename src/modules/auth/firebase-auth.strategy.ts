import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(token: string): Promise<DecodedIdToken> {
    return auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        console.warn(err);
        throw new UnauthorizedException();
      });
  }
}
