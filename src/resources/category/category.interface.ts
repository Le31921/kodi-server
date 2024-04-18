import { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string
  description?: string
  tags: string[]
  slug: string
  ancestor: string | Schema.Types.ObjectId | Partial<ICategory>
  access: 'public' | 'private'
  user?: string
}