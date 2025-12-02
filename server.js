require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

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
}

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("JWT auth api running...");
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
