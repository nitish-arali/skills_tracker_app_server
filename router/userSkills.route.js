import express from "express";
import {
  AddUserSkills,
  GetOverallUserSkills,
  GetSkillsForUser,
  GetTopTenSkills,
  ModifyUserSkills,
} from "../controllers/userSkills.controller.js";

const router = express.Router();

router.post("/addUserSkills", AddUserSkills);
router.put("/modifyUserSkills", ModifyUserSkills);
router.get("/getSkillsForUser/:id", GetSkillsForUser);
router.get("/GetOverallUserSkills", GetOverallUserSkills);
router.get("/GetTopTenSkills", GetTopTenSkills);

export default router;
