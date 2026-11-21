import { BrandInterface } from "./brands.type"
import { CategoryInterface } from "./category.type"
import { SubcategoryInterface } from "./subcategories.type"

export interface ProductInterface {
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
  priceAfterDiscount?: number
  imageCover: string
  category:   CategoryInterface
  brand: BrandInterface
  ratingsAverage: number
  createdAt: string
  updatedAt: string
  id: string
}


