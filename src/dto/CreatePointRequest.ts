export class CreateReviewRequest {
  type!: string;
  action!: string;
  reviewId!: string;
  content!: string;
  attachedPhotoIds!: string[];
  userId!: string;
  placeId!: string;
}
