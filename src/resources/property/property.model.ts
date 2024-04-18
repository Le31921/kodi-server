import { Schema, model } from "mongoose";
import { IPropertyModel } from "./property.interface";

const PropertySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['sale', 'rent'],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },

    price: {
      type: Number,
      default: 0
    },
    
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    details: {
      roomNo:  {
        type: Number,
        default: 1
      },
      bedNo:  {
        type: Number,
        default: 1
      },
      area:  {
        type: Number,
        default: 1
      },
      status: {
        type: String,
        enum: ['active', 'taken'],
      },
    }
  },
  {
    timestamps: true
  }
)

const PropertyModel = model<IPropertyModel>('Property', PropertySchema)

export default PropertyModel