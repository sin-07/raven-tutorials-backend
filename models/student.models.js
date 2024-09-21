import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    schoolname: {
      type: String,
    },
    standard: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    alternatecontact: {
      type: String,
    },
    guardianname: {
      type: String,
      required: true,
    },
    bloodgroup: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    hobby: {
      type: String,
      required: true,
    },
    profileimage: {
      type: String, // cloudinary uri
      required: true,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
