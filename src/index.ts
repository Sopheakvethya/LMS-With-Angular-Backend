import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import userRouter from "./routes/user/index";
import courseRouter from "./routes/course/index";
import lessonRouter from "./routes/lesson/index";
import assignmentRouter from "./routes/assignment/index";
import submissionRouter from "./routes/submission/index";
import sectionRouter from "./routes/section/index";
import { connectDB } from "./db";

dotenv.config();
dotenv.config({ path: path.join(__dirname, "../.env") });
const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/submission", submissionRouter);
app.use("/api/section", sectionRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`🎉 Server is running on port ${PORT}`);
});
