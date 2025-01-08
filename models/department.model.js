import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  Department: {
    type: String,
  },
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
