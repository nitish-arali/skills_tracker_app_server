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
  skillLevel: {
    type: Number,
  },
  month: {
    type: Date,
  },
  lastUpdated: {
    type: String,
  },
  learningSource: {
    type: String,
  },
});

const addSkillsSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: [true, "Please select User Name"],
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userSkills: {
      currentMonth: [skills],
      previousMonth: [skills],
    },
  },
  {
    timestamps: true,
  }
);

const UserSkills = mongoose.model("UserSkills", addSkillsSchema);

export default UserSkills;
