import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
import express, { json } from "express";
import authRoutes from "./routes/auth.ts";
import profileRoutes from "./routes/profile.ts";
import connectDB from "./config/db.js";

const app = express();

// Basic env validation to help detect .env loading issues
if (!process.env.MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI is not set. Check your .env or compose file."
  );
} else {
  // Print a redacted form to avoid leaking credentials
  const redacted = process.env.MONGO_URI.replace(/:(?:[^@]+)@/, ":***@");
  console.log(`MONGO_URI=${redacted}`);
  await connectDB();
}

app.use(json());

app.get("/", (req, res) => {
  res.send("JWT auth api running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
