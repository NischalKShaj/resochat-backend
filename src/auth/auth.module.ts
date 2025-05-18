// for the auth

// importing the required modules
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET not defined');
        }
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '72h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
