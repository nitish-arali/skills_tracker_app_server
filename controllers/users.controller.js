import User from "../models/user.model.js";

import bcrypt from "bcrypt";

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
    const { userName, department, emailId, isAdmin } = req.body;

    const genericPassword = "NecIndia@2025";
    const hashedGenericPassword = await bcrypt.hash(genericPassword, 10);

    const newUser = new User({
      userName,
      department,
      emailId,
      isAdmin,
      password: hashedGenericPassword,
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

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword, UserId } = req.body;

  // Check if user exists
  const userExist = await User.findOne({ _id: UserId });
  if (!userExist) {
    return res.status(400).json({ message: "Invalid User" });
  }

  // Check if new password matches confirm password
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New passwords do not match" });
  }

  // Verify old password
  const isOldPasswordValid = await bcrypt.compare(
    oldPassword,
    userExist.password
  );
  if (!isOldPasswordValid) {
    return res.status(400).json({ message: "Invalid Old Password" });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    userExist.password = hashedPassword;
    await userExist.save();

    res.status(201).json({ message: "Password Changed Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

export { getAllUsers, addUser, getUsersByDepartment, changePassword };
