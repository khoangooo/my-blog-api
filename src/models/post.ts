import { IPost } from "../types/posts"
import { model, Schema } from "mongoose"

const postSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
)

export default model<IPost>("Post", postSchema)