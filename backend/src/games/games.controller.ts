import { Body, Controller, Get, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  createGame(@Body() body: CreateGameDto) {
  return this.gamesService.createGame(body);
}

  @Get()
  getAllGames() {
    return this.gamesService.getAllGames();
  }
}
