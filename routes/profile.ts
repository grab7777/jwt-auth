import express, { type Request, type Response } from "express";
import auth from "../middleware/auth.ts";
import User from "../models/user.ts";

const router = express.Router();

router.get("/me", auth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  console.log("Authenticated user:", user);
  
  const userData = await User.findById(user.id).select("-password");
  if (!userData) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(userData);
});

export default router;
