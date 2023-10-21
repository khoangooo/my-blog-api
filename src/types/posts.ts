import { Document } from "mongoose"

export interface IPost extends Document {
  title: string;
  excerpt: string;
  content: boolean;
}