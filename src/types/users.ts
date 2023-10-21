import { Document } from "mongoose"

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  avatar?: string;
  role?: string;
}