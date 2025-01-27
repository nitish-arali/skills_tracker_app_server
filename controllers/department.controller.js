import Department from "../models/department.model.js";

const getAllDepartments = async (req, res) => {
  try {
    const Departments = await Department.find();
    if (!Departments.length) {
      res.status(404).json({ message: "Departments not found" });
    } else {
      res.status(200).json(Departments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    const dept = new Department({
      Department: department,
    });
    await dept.save();

    res.status(201).json({ message: "Department Added Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllDepartments, addDepartment };
