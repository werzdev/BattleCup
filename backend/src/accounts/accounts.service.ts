import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async validateUser(username: string, password: string) {
    const account = await this.prisma.account.findUnique({
      where: { username },
    });
    if (!account) return null;

    const isMatch = await bcrypt.compare(password, account.password);
    if (isMatch) {
      return { id: account.id, username: account.username };
    }

    return null;
  }
}
