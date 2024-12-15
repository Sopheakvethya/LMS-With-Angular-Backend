import type { Response, NextFunction, Request } from "express";
import jwtGenerate from "../utils/jwt-generate";
import { getUserByUsernameService } from "../routes/user/user.service";

export async function isAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      res.status(401).json({ message: "Token is required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await jwtGenerate.getTokenInfo(token);

    const user = await getUserByUsernameService(decodedToken.username);
    if (!user) {
      res.status(401).json({ message: "User unauthorized" });
      return;
    }

    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.log("Token error: ", error.message);
    if (error.message === "jwt expired") {
      res.status(401).json({ message: "Expired token" });
      return;
    }
    res.status(401).json({ message: error.message });
    return;
  }
}
