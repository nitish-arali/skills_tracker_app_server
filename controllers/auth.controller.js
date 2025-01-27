import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model.js";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

dotenv.config();

const Login = async (req, res) => {
  try {
    const { emailId, Password } = req.body;
    const userExist = await User.find({ emailId });
    console.log(userExist);

    if (!userExist) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isUserIdValid = userExist[0].emailId === emailId;

    const isPasswordValid = await bcrypt.compare(
      Password,
      userExist[0].password
    );

    const adminMenuAccess = userExist[0].isAdmin;

    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const accessToken = jwt.sign({ userId: userExist._id }, ENCRYPTION_KEY, {
      expiresIn: "60m",
    });

    const LeftMenuItemsAdmin = [
      { key: "1", label: "Home", route: "/" },
      { key: "2", label: "Add New Skill", route: "/addNewSkills" },
      {
        key: "5",
        label: "Skill Overview",
        route: "/skillsOverviewAdmin",
      },
      { key: "6", label: "Masters", route: "/masters" },
    ];
    const LeftMenuItemsUser = [
      { key: "1", label: "Home", route: "/" },
      { key: "2", label: "Add New Skill", route: "/addNewSkills" },
      { key: "4", label: "Skill Overview", route: "/skillsOverview" },
    ];

    const responseData = {
      UserContext: {
        UserId: userExist[0]._id,
        UserName: userExist[0].userName,
        isAuthenticated: true,
        isAdmin: userExist[0].isAdmin,
      },
      Accesstoken: accessToken,
      LeftMenu: adminMenuAccess ? LeftMenuItemsAdmin : LeftMenuItemsUser,
    };

    if (isUserIdValid && isPasswordValid) {
      res.status(200).json(responseData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export { Login };
