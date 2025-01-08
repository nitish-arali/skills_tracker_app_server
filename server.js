import express from "express";
import mongoose from "mongoose";
import connectDb from "./utils/db.js";
import cors from "cors";
import userSkillsRouter from "./router/userSkills.route.js";
import skillsRouter from "./router/skills.route.js";
import usersRouter from "./router/users.router.js";
import departmentRouter from "./router/departments.route.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1", userSkillsRouter);
app.use("/api/v1", usersRouter);
app.use("/api/v1", skillsRouter);
app.use("/api/v1", departmentRouter);

const PORT = 5000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
