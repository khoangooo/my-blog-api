import jwt, { Secret, JwtPayload, VerifyErrors, Jwt } from "jsonwebtoken";

const login = (payload: JwtPayload, expiresIn = '10m') => {
  //creating a access token
  const accessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as Secret;
  const accessToken = jwt.sign(payload, accessTokenSecretKey, { expiresIn })

  // Creating refresh token not that expiry of refresh 
  //token is greater than the access token
  const refreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as Secret;
  const refreshToken = jwt.sign(payload, refreshTokenSecretKey, { expiresIn: "30 days" })

  return { accessToken, refreshToken };
}

const generateAccessToken = (refreshToken: string) => {
  let accessToken = "";
  const refreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as Secret;
  // Verifying refresh token

  const verifyCallback = (
    err: VerifyErrors | null,
    decoded: Jwt | JwtPayload | string | undefined
  ) => {
    if (!err) {
      // Correct token we send a new access token
      const accessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as Secret;
      const decodeData = decoded as JwtPayload;
      decodeData.timeout = new Date().getSeconds(); //update new timeout
      accessToken = jwt.sign(decodeData, accessTokenSecretKey, { expiresIn: '10m' });
    }
  }
  jwt.verify(refreshToken, refreshTokenSecretKey, verifyCallback)
  return accessToken;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}

export { login, generateAccessToken, getErrorMessage };