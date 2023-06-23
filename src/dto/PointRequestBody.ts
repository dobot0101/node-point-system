import { IsNumber, IsString, IsUUID } from 'class-validator';

export class PointRequestBody {
  @IsUUID()
  userId!: string;
  @IsString()
  sourceType!: string;
  @IsUUID()
  sourceId!: string;
  @IsString()
  memo!: string;
  @IsNumber()
  amount!: number;
}
