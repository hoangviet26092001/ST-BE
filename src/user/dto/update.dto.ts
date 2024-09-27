import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateDto } from './create.dto';

export class UpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  age: number;
}
