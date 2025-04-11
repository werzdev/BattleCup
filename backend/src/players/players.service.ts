import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async createPlayer(name: string, avatarUrl: string | null) {
    return this.prisma.player.create({
      data: {
        name,
        avatarUrl: avatarUrl || null, // Use the provided avatarUrl or null if not provided
      },
    });
  }

  async getAllPlayers() {
    return this.prisma.player.findMany();
  }

  async getPlayerById(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }

  async getPlayerStats(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const hitRate =
      player.hits + player.misses > 0
        ? (player.hits / (player.hits + player.misses)) * 100
        : 0;

    const bombHitRate =
      player.bombHits + player.bombMisses > 0
        ? (player.bombHits / (player.bombHits + player.bombMisses)) * 100
        : 0;

    const bounceHitRate =
      player.bounceHits + player.bounceMisses > 0
        ? (player.bounceHits / (player.bounceHits + player.bounceMisses)) * 100
        : 0;

    const winRate =
      player.wins + player.losses > 0
        ? (player.wins / (player.wins + player.losses)) * 100
        : 0;

    return {
      winRate: winRate.toFixed(2),
      hitRate: hitRate.toFixed(2),
      bombHitRate: bombHitRate.toFixed(2),
      bounceHitRate: bounceHitRate.toFixed(2),
    };
  }

  async updatePlayer(id: string, name?: string, avatarUrl?: string) {
    return this.prisma.player.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(avatarUrl && { avatarUrl }),
      },
    });
  }
}
