import UserSkills from "../models/userSkills.model.js";

const AddUserSkills = async (req, res) => {
  try {
    const { Department, User, userSkills, UserId, UserName } = req.body;
    const newSkills = new UserSkills({
      Department,
      User,
      userSkills,
      UserId,
      UserName,
    });

    await newSkills.save();
    res.status(201).json({
      message: "Skills added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ModifyUserSkills = async (req, res) => {
  try {
    const { userSkills, UserId } = req.body;

    // Check if the user exists
    const existingUser = await UserSkills.findOne({ UserId });

    if (!existingUser) {
      // User not found
      return res.status(404).json({ message: "User Not Found" });
    }

    // Update the userSkills for the existing user
    existingUser.userSkills = userSkills; // Update only the userSkills

    // Save the updated userSkills
    await existingUser.save();

    res.status(200).json({
      message: "Skills updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetSkillsForUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: "Invalid User" });
      return;
    }

    const userObj = await UserSkills.findOne({ UserId: userId }).populate(
      "UserId"
    );

    if (!userObj) {
      res.status(404).json({ message: "User Not Found" });
    } else {
      res.status(200).json(userObj);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export { AddUserSkills, GetSkillsForUser, ModifyUserSkills };
