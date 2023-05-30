import jwt, { Secret, JwtPayload } from "jsonwebtoken";

const generateToken = (payload: JwtPayload, expiresIn = 10) => {
  const secretSignature = process.env.JWT_SECRET_KEY as Secret;
  return jwt.sign(payload, secretSignature, { expiresIn });
}

const verifyToken = (token: string) => {
  const secretSignature = process.env.JWT_SECRET_KEY as Secret;
  const decoded = jwt.verify(token, secretSignature);
  return decoded
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}

export { generateToken, verifyToken, getErrorMessage };