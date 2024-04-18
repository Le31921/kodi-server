import { model, Schema } from "mongoose";

import { ICategory } from "@resources/category/category.interface";

import { createSlug } from "@utils/helpers";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
  },

  tags: [
    { type: String }
  ],

  slug: {
    type: String,
  },

  ancestor: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  access: {
    type: String,
    enum: ['private', 'public'],
    default: 'public'
  }
})

CategorySchema.pre('save', function (next) {
  // Skip if name is not modified.
  if (!this.isModified('name')) {
    return next()
  }

  this.slug = createSlug(this.name)

  return next()
})

export default model<ICategory>('Category', CategorySchema)