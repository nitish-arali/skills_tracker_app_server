import express from "express";
import { Login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", Login);

export default router;
