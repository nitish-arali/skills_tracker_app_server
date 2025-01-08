import Skills from "../models/skills.model.js";

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skills.find();
    if (!skills.length) {
      res.status(404).json({ message: "Skills not found" });
    } else {
      res.status(200).json(skills);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSkill = async (req, res) => {
  try {
    const { Skill } = req.body;
    const newSkill = new Skills({
      Skill,
    });
    await newSkill.save();

    res.status(201).json({ message: "Skill Added Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllSkills, addSkill };
