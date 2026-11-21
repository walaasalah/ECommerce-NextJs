import { BrandInterface } from "./brands.type"
import { CategoryInterface } from "./category.type"
import { SubcategoryInterface } from "./subcategories.type"

export interface ProductDtlI {
  sold: number
  images: string[]
  subcategory: SubcategoryInterface[]
  ratingsQuantity: number
  _id: string
  title: string
  slug: string
  description: string
  quantity: number
  price: number
  imageCover: string
  category: CategoryInterface
  brand: BrandInterface
  ratingsAverage: number
  createdAt: string
  updatedAt: string
  __v: number
  reviews: Review[]
  id: string
}



export interface Review {
  _id: string
  review: string
  rating: number
  product: string
  user: User
  createdAt: string
  updatedAt: string
  __v: number
}

export interface User {
  _id: string
  name: string
}
