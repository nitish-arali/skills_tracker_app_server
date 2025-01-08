import express from "express";
import {
  addUser,
  getAllUsers,
  getUsersByDepartment,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.post("/addUser", addUser);
router.get("/getUsersByDepartment/:department", getUsersByDepartment);

export default router;
