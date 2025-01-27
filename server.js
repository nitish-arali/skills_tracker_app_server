import express from "express";
import connectDb from "./utils/db.js";
import cors from "cors";
import userSkillsRouter from "./router/userSkills.route.js";
import skillsRouter from "./router/skills.route.js";
import usersRouter from "./router/users.router.js";
import departmentRouter from "./router/departments.route.js";
import authRouter from "./router/auth.route.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/auth/login", authRouter);
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
