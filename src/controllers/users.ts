import { Response, Request } from "express"
import { IUser } from "@/types/users"
import User from "@/models/user";
import bcrypt from "bcrypt";
import { login, generateAccessToken, getErrorMessage } from "@/utils";

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body: { username, password } } = req;
    const user: IUser | null = await User.findOne({ username });

    if (user?.password) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          const newUser = user.toObject() as Partial<IUser>;
          delete newUser.password;
          const { accessToken, refreshToken } = login(newUser);
          
          // Assigning refresh token in http-only cookie 
          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
          });
          newUser.token = accessToken;
          res.status(200).json({ status: true, data: newUser });
        } else {
          res.status(401).json({ status: false, message: 'Passwords do not match' });
        }
      });
    } else {
      res.status(404).json({ status: false, message: 'User is not existed' })
    }
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const getAccesToken = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;
      const accessToken = generateAccessToken(refreshToken);
      if (accessToken) {
        res.status(200).json({ status: true, data: { token: accessToken } });
      } else {
        res.status(401).json({ status: false, message: 'Invalid refresh token' });
      }
    }

  } catch(error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const UsersController = { getUser, getAccesToken }

export default UsersController;