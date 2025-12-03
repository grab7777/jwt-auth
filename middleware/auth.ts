import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";

interface JwtPayload {
  id: string;
  email: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    console.log("Verified payload:", payload);
    (req as any).user = { id: payload.id, email: payload.email };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      console.error("JWT Error:", error.message);
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
