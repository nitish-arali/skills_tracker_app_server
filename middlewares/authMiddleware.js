import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  console.log("Request Object", req);
  next();
};

export default authMiddleware;
