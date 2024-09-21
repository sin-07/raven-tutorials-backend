
import mongoose from "mongoose";

const loginStudentSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp:{
    type: Number,
    default: 0,
  }
});
const LoginStudent = mongoose.model("LoginStudent", loginStudentSchema);
export default LoginStudent;
