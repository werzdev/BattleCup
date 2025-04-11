import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars', // Store uploaded avatars in this folder
        filename: (req, file, callback) => {
          const fileName = Date.now() + extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  create(
    @Body() body: { name: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = file
      ? `/uploads/avatars/${file.filename}` // Store the image path if file uploaded
      : null;

    // If avatarUrl is null, it will fallback to default in Prisma schema
    return this.playersService.createPlayer(body.name, avatarUrl);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const avatarUrl = file ? `avatars/${file.filename}` : undefined;
    return this.playersService.updatePlayer(id, body.name, avatarUrl);
  }

  @Get()
  findAll() {
    return this.playersService.getAllPlayers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.getPlayerById(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.playersService.getPlayerStats(id);
  }
}
