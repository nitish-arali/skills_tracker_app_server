import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please add User Name"],
  },
  department: {
    type: String,
    required: [true, "Please add Department"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
