
import { ProductInterface } from "./product.Type"

export interface CartDataInterface {
  status: string
  message: string
  numOfCartItems: number
  cartId: string
  data: Data
}

export interface Data {
  _id: string
  cartOwner: string
  products: CartProductInterface[]
  createdAt: string
  updatedAt: string
  __v: number
  totalCartPrice: number
  totalAfterDiscount?: number
}

export interface CartProductInterface {
  count: number
  _id: string
  product: ProductInterface
  price: number
}

// export interface Product2 {
//   subcategory: SubcategoryInterface[]
//   _id: string
//   title: string
//   slug: string
//   quantity: number
//   imageCover: string
//   category: CategoryInterface
//   brand: BrandInterface
//   ratingsAverage: number
//   id: string
// }

// export interface Subcategory {
//   _id: string
//   name: string
//   slug: string
//   category: string
// }

// export interface Category {
//   _id: string
//   name: string
//   slug: string
//   image: string
// }

// export interface Brand {
//   _id: string
//   name: string
//   slug: string
//   image: string
// }
