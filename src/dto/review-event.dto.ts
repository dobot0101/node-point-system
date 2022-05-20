export class ReviewEventDto {
  type!: string;
  action!: string;
  reviewId!: string;
  content!: string;
  attachedPhotoIds!: string[];
  userId!: string;
  placeId!: string;
}
