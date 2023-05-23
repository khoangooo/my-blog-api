import { Response, Request } from "express"
import { IUser } from "../../types/users"
import User from "../../models/user";
import bcrypt from "bcrypt";

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body: { email, password } } = req;
    const user: IUser | null = await User.findOne({ email });
    if (user?.password) {
      bcrypt.compare(password, user.password, function(err, result) {
        if(result){
          const newUser = user.toObject() as Partial<IUser>;
          delete newUser.password;
          res.status(200).json({status: true, data: newUser });
        } else {
          res.status(401).json({status: false, message: 'Passwords do not match'});
        }
      });
    } else {  
      res.status(404).json({ status: false, message: 'User is not existed' })
    }
  } catch (error) {
    throw error
  }
}

export { getUser }