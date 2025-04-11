import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async getAllGames() {
    return this.prisma.game.findMany({
      include: {
        participations: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async createGame(data: CreateGameDto) {
    const participants = data.participants.map((p) => ({
      team: p.team,
      player: {
        connect: { id: p.playerId },
      },
    }));
  
    return this.prisma.game.create({
      data: {
        teamAScore: data.teamAScore,
        teamBScore: data.teamBScore,
        participations: {
          create: participants,
        },
      },
      include: {
        participations: {
          include: {
            player: true,
          },
        },
      },
    });
  }
}