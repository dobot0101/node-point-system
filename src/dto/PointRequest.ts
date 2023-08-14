import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { PointSourceType } from '../entities/Point';

export class PointRequest {
  @IsUUID()
  userId!: string;

  // @IsEnum(PointSourceType)
  // sourceType!: PointSourceType;

  @IsUUID()
  reviewId!: string;

  @IsUUID()
  placeId?: string | null;

  // @IsString()
  // memo!: string;

  @IsNumber()
  amount!: number;
}
