import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { EventStatus } from '../event.entity';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EventStatus)
  status: EventStatus;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsArray()
  invitees: number[]; // list of user IDs
}

