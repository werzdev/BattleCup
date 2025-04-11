import {
    IsArray,
    ValidateNested,
    IsEnum,
    IsString,
    Length,
    IsInt,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export enum Team {
    A = 'A',
    B = 'B',
  }
  
  export class GameParticipantDto {
    @IsString()
    @Length(1)
    playerId: string;
  
    @IsEnum(Team)
    team: Team;
  }
  
  export class CreateGameDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GameParticipantDto)
    participants: GameParticipantDto[];
  
    @IsInt()
    @Min(0)
    teamAScore: number;
  
    @IsInt()
    @Min(0)
    teamBScore: number;
  }
  