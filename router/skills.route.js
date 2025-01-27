import express from "express";
import { addSkill, getAllSkills } from "../controllers/skills.controller.js";

const router = express.Router();

router.get("/getAllSkills", getAllSkills);
router.post("/addSkill", addSkill);

export default router;
