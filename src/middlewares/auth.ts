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

    const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as Secret;
    const decoded = jwt.verify(token, secretKey);
    if (decoded) {
      res.locals.user = decoded;
      next();
    } else {
      res.status(401).send('Invalid token');
    }

  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};