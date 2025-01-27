import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  emailId: {
    type: String,
    required: [true, "Please Provide email Id"],
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
  },
  userName: {
    type: String,
    required: [true, "Please add User Name"],
  },
  department: {
    type: String,
    required: [true, "Please add Department"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
