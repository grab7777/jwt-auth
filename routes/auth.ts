import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.ts";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "Sorry, wrong login credentials",
      });
    }
    const isPasswordOk = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordOk) {
      return res.status(400).json({
        message: "Sorry, wrong login credentials",
      });
    }
    const payload = { id: existingUser.id, email: existingUser.email };
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not set in env" });
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

export default router;
