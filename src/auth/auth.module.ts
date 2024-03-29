import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { applicationConfig } from 'config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: applicationConfig.jwt.secret,
      signOptions: { expiresIn: `${applicationConfig.jwt.expiresIn}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
