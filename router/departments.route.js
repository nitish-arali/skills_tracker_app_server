import express from "express";
import {
  addDepartment,
  getAllDepartments,
} from "../controllers/department.controller.js";

const router = express.Router();

router.get("/getAllDepartments", getAllDepartments);
router.post("/addDepartment", addDepartment);

export default router;
