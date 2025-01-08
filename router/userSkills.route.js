import express from "express";
import {
  AddUserSkills,
  GetSkillsForUser,
  ModifyUserSkills,
} from "../controllers/userSkills.controller.js";

const router = express.Router();

router.post("/addUserSkills", AddUserSkills);
router.put("/modifyUserSkills", ModifyUserSkills);
router.get("/getSkillsForUser/:id", GetSkillsForUser);

export default router;
