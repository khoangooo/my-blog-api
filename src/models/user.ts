import { IUser } from "../types/users"
import { model, Schema } from "mongoose"

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      index: { unique: true }
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    avatar: String,
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
)

export default model<IUser>("User", userSchema)