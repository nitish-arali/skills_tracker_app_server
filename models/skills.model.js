import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema({
  Skill: {
    type: String,
  },
  isProjectRelated: {
    type: Boolean,
  },
});

const Skills = mongoose.model("Skills", skillsSchema);

export default Skills;
