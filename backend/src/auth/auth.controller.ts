// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service'; // Ensure you import AuthService here

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {} // Inject AuthService

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.login(body.username, body.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { message: 'Login successful', user };
  }
}
