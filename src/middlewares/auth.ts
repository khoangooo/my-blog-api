import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const secretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as Secret;
    const decoded = jwt.verify(token, secretKey);
    (req as CustomRequest).token = decoded;
    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};