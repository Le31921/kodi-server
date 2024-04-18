import { Schema, Document } from "mongoose"

export interface IProperty {
  name: string
  description: string
  type: string
  price: number
  location: {
    lat: number
    long: number
    name: string
  }
  user: string | Schema.Types.ObjectId
  category?: string | Schema.Types.ObjectId
  details: {
    roomNo: number
    bedNo: number
    area: number
    status: "active" | "taken"
  }
}

export interface IPropertyModel extends IProperty, Document {}