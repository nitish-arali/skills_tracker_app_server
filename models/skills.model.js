import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema({
  Skill: {
    type: String,
  },
});

const Skills = mongoose.model("Skills", skillsSchema);

export default Skills;
