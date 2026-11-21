export interface ProductReview {
  _id: string;
  review: string;
  rating: number;
  user?: { _id: string; name: string } | null;
  createdAt: string;
}
export interface ProductReviewPage {
  data: ProductReview[];
  results: number;
  metadata: { currentPage: number; numberOfPages: number };
}
