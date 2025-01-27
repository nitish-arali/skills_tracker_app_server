import dayjs from "dayjs";
import UserSkills from "../models/userSkills.model.js";

const AddUserSkills = async (req, res) => {
  try {
    const { userSkills, UserId, UserName } = req.body;

    console.log("Received Data for New Skills: ", userSkills, UserId);

    // Create a new UserSkills document with the categorized data
    const newSkills = new UserSkills({
      userSkills: {
        currentMonth: userSkills,
      },
      UserId,
      UserName,
    });

    // Save the new skills data
    await newSkills.save();

    res.status(201).json({
      message: "Skills added successfully",
    });
  } catch (error) {
    console.error("Error in adding new user skills:", error);
    res.status(500).json({ message: error.message });
  }
};

const ModifyUserSkills = async (req, res) => {
  try {
    const { userSkills, UserId } = req.body;

    console.log("Received Data: ", userSkills, UserId);

    // Check if the user exists
    const existingUser = await UserSkills.findOne({ UserId });

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Get the current date from first skill in incoming data
    // Client is sending month in format "MMMM YYYY" (e.g. "January 2025")
    const incomingMonth = userSkills[0].month;

    // Get current month in same format from system
    const currentDate = new Date();
    const systemMonth = dayjs(currentDate).format("MMMM YYYY");

    if (incomingMonth === systemMonth) {
      // If skills are for current month, only update currentMonth array
      existingUser.userSkills = {
        currentMonth: userSkills,
        previousMonth: existingUser.userSkills.previousMonth, // Keep previous month unchanged
      };
    } else if (dayjs(incomingMonth).isAfter(dayjs(systemMonth), "month")) {
      // If skills are for next month, move current to previous
      existingUser.userSkills = {
        currentMonth: userSkills,
        previousMonth: existingUser.userSkills.currentMonth,
      };
    } else {
      // If skills are for a past month, reject
      return res.status(400).json({
        message: "Cannot update skills for past months",
      });
    }

    // Save the updated userSkills
    await existingUser.save();

    res.status(200).json({
      message: "Skills updated successfully",
    });
  } catch (error) {
    console.error("Error in modifying user skills:", error);
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
      res.status(404).json({ message: "No Existing Skills Found" });
    } else {
      res.status(200).json(userObj);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const GetOverallUserSkills = async (req, res) => {
  try {
    const MemberCount = await UserSkills.aggregate([
      {
        $unwind: "$userSkills.currentMonth",
      },
      {
        $group: {
          _id: "$userSkills.currentMonth.skillId",
          skillName: { $first: "$userSkills.currentMonth.skill" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          skillId: "$_id",
          skillName: 1,
          count: 1,
        },
      },
    ]);

    const SegregatedSkillsBasedOnLevels = await UserSkills.aggregate([
      {
        $unwind: "$userSkills.currentMonth",
      },
      {
        $group: {
          _id: "$userSkills.currentMonth.skill",
          beginner: {
            $sum: {
              $cond: [
                { $eq: ["$userSkills.currentMonth.skillLevel", 1] },
                1,
                0,
              ],
            },
          },
          intermediate: {
            $sum: {
              $cond: [
                { $eq: ["$userSkills.currentMonth.skillLevel", 2] },
                1,
                0,
              ],
            },
          },
          expert: {
            $sum: {
              $cond: [
                { $eq: ["$userSkills.currentMonth.skillLevel", 3] },
                1,
                0,
              ],
            },
          },
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          skill: "$_id",
          beginner: 1,
          intermediate: 1,
          expert: 1,
          totalCount: 1,
        },
      },
      {
        $sort: { skill: 1 },
      },
    ]);

    const ProgressTrack = await UserSkills.aggregate([
      {
        $project: {
          userName: "$UserName",
          skillsProgress: {
            $map: {
              input: "$userSkills.currentMonth",
              as: "currentSkill",
              in: {
                skill: "$$currentSkill.skill",
                skillLevel: "$$currentSkill.skillLevel",
                isNewLearner: {
                  $not: {
                    $anyElementTrue: {
                      $map: {
                        input: "$userSkills.previousMonth",
                        as: "prevSkill",
                        in: {
                          $eq: ["$$prevSkill.skill", "$$currentSkill.skill"],
                        },
                      },
                    },
                  },
                },
                previousSkillLevel: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$userSkills.previousMonth",
                        as: "prevSkill",
                        cond: {
                          $eq: ["$$prevSkill.skill", "$$currentSkill.skill"],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $unwind: "$skillsProgress",
      },
      {
        $addFields: {
          skill: "$skillsProgress.skill",
          newLearner: { $cond: ["$skillsProgress.isNewLearner", 1, 0] },
          beginnerToIntermediate: {
            $cond: [
              {
                $and: [
                  { $eq: ["$skillsProgress.previousSkillLevel.skillLevel", 1] },
                  { $eq: ["$skillsProgress.skillLevel", 2] },
                ],
              },
              1,
              0,
            ],
          },
          intermediateToExpert: {
            $cond: [
              {
                $and: [
                  { $eq: ["$skillsProgress.previousSkillLevel.skillLevel", 2] },
                  { $eq: ["$skillsProgress.skillLevel", 3] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$skill",
          newLearners: { $sum: "$newLearner" },
          beginnerToIntermediate: { $sum: "$beginnerToIntermediate" },
          intermediateToExpert: { $sum: "$intermediateToExpert" },
        },
      },
      {
        $project: {
          _id: 0,
          skill: "$_id",
          newLearners: 1,
          beginnerToIntermediate: 1,
          intermediateToExpert: 1,
        },
      },
      {
        $sort: { skill: 1 },
      },
    ]);

    res.status(200).json({
      memberCount: MemberCount,
      segregatedSkills: SegregatedSkillsBasedOnLevels,
      progressTrack: ProgressTrack,
    });
  } catch (err) {
    console.error("Error fetching overall skills:", err);
    res.status(500).json({ message: "Error fetching overall skills" });
  }
};

const GetTopTenSkills = async (req, res) => {
  try {
    const TopTenSkills = await UserSkills.aggregate([
      {
        $unwind: "$userSkills.currentMonth",
      },
      {
        $group: {
          _id: "$userSkills.currentMonth.skill",
          beginner: {
            $sum: {
              $cond: [
                { $eq: ["$userSkills.currentMonth.skillLevel", 1] },
                1,
                0,
              ],
            },
          },
          intermediate: {
            $sum: {
              $cond: [
                { $eq: ["$userSkills.currentMonth.skillLevel", 2] },
                1,
                0,
              ],
            },
          },
          expert: {
            $sum: {
              $cond: [
                { $eq: ["$userSkills.currentMonth.skillLevel", 3] },
                1,
                0,
              ],
            },
          },
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          skill: "$_id",
          beginner: 1,
          intermediate: 1,
          expert: 1,
          totalCount: 1,
        },
      },
      {
        $sort: { totalCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    res.status(200).json(TopTenSkills);
  } catch (error) {
    console.error("Error fetching top ten skills:", error);
    res.status(500).json({ message: "Error fetching overall skills" });
  }
};

export {
  AddUserSkills,
  GetSkillsForUser,
  ModifyUserSkills,
  GetOverallUserSkills,
  GetTopTenSkills,
};
