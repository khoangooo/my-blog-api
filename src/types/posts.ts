import { Document } from "mongoose"

export interface IPost extends Document {
  name: string
  description: string
  status: boolean
}