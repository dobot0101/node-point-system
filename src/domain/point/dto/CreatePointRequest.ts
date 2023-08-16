import { IsUUID } from 'class-validator';

export class CreatePointRequest {
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

  // @IsNumber()
  // amount!: number;
}
