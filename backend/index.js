import authRoutes from "./routes/auth.routes.js";
import theoryAuthorRoutes from "./routes/thoeryAuthor.routes.js";
import theoryCommonRoutes from "./routes/theoryCommon.routes.js";
import connectDB from "./lib/db.lib.js";
import cookieParser from "cookie-parser";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL_BASE = process.env.FRONTEND_URL_BASE || "http://localhost:3000";


app.use(cors({
  origin: FRONTEND_URL_BASE, 
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/author", theoryAuthorRoutes);
app.use("/api/common", theoryCommonRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
