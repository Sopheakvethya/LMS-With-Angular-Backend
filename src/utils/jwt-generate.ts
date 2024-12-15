import jwt from "jsonwebtoken";
import type { UserPayloadDTO } from "../types/user/user-payload-dto";

export async function signTokens(payload: UserPayloadDTO) {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";

  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: "7d",
  });

  return { accessToken: accessToken, refreshToken: refreshToken };
}

export async function getTokenInfo(token: string) {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const decodedToken = jwt.verify(token, accessTokenSecret!);

  return decodedToken as UserPayloadDTO;
}

export default { signTokens, getTokenInfo };
