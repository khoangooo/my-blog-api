import { Response, Request } from "express"
import { IUser } from "@/types/users"
import User from "@/models/user";
import bcrypt from "bcrypt";
import { getErrorMessage } from "@/utils";
import jwt, { Secret } from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "10"; //mins
const REFRESH_TOKEN_EXPIRES_IN = "30"; //days
const NUM_SALT_ROUNDS = 10;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body: { username, password } } = req;
    const user: IUser | null = await User.findOne({ username });

    if (user?.password) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const data = user.toObject() as Partial<IUser>;
        delete data.password
        const accessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as Secret;
        const refreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as Secret;

        const accessToken = jwt.sign(data, accessTokenSecretKey, { expiresIn: ACCESS_TOKEN_EXPIRES_IN + "m" })
        const refreshToken = jwt.sign(data, refreshTokenSecretKey, { expiresIn: REFRESH_TOKEN_EXPIRES_IN + "days" })

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: parseInt(REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
          status: true,
          data: {
            token: accessToken,
            timeout: Date.now() + parseInt(ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000
          }
        });
      } else {
        res.status(401).json({ status: false, message: 'Passwords do not match' });
      }
    } else {
      res.status(404).json({ status: false, message: 'User is not existed' })
    }
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user
    if (user) {
      res.status(200).json({ status: true, data: user });
    } else {
      res.status(404).json({ status: false, message: 'User is not existed' })
    }
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    if (await User.findOne({ username: req.body.username })) {
      res.status(409).json({ status: false, message: 'User is existed' });
      return;
    }

    const hash = await bcrypt.hash(req.body.password, NUM_SALT_ROUNDS);
    const user = (await User.create({ ...req.body, password: hash })).toJSON();
    const data: Omit<IUser, "password"> = user;

    res.status(200).json({ status: true, data });

  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as Secret;
    const refreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as Secret;

    const decoded = jwt.verify(refreshToken, refreshTokenSecretKey);
    if (!decoded) {
      res.status(401).json({ status: false, message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign(decoded, accessTokenSecretKey);
    res.status(200).json({
      status: true,
      data: {
        token: accessToken,
        timeout: Date.now() + parseInt(ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000
      }
    });

  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user;
    if (user) {
      res.clearCookie('refreshToken')
      res.status(200).json({ status: true, message: 'Logout successfully' });
    } else {
      res.status(404).json({ status: false, message: 'Logout failed' })
    }
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const UsersController = { login, refresh, getUser, register, logout }

export default UsersController;