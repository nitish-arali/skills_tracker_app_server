import User from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      res.status(404).json({ message: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { userName, department } = req.body;
    const newUser = new User({
      userName,
      department,
    });
    await newUser.save();

    res.status(201).json({ message: "User Added Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUsersByDepartment = async (req, res) => {
  try {
    const department = req.params.department;

    if (!department) {
      res.status(400).json({ message: "Invalid department" });
      return;
    }
    const users = await User.find({ department });
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, addUser, getUsersByDepartment };
