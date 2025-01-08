import mongoose from "mongoose";

const skills = new mongoose.Schema({
  skill: {
    type: String,
  },
  _id: false,
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  skillLevel: [
    {
      currentLevel: { type: Number },
      updatedLevel: { type: Number },
      _id: false,
    },
  ],
});

const addSkillsSchema = new mongoose.Schema(
  {
    Department: {
      type: String,
      required: [true, "Please select Department Name"],
    },
    UserName: {
      type: String,
      required: [true, "Please select User Name"],
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userSkills: [skills],
  },
  {
    timestamps: true,
  }
);

const UserSkills = mongoose.model("UserSkills", addSkillsSchema);

export default UserSkills;
