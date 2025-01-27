import express from "express";
import {
  addUser,
  changePassword,
  getAllUsers,
  getUsersByDepartment,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.post("/addUser", addUser);
router.get("/getUsersByDepartment/:department", getUsersByDepartment);
router.put("/changePassword", changePassword);

export default router;
