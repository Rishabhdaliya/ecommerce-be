import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./src/router/user.router.js";

dotenv.config();

const app = express();
const PORT = 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000/", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", function (req, res) {
  res.send("Health check up");
});

userRouter(app);

// app.use("/api/v1/user", userRouter); // Use the imported router here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
