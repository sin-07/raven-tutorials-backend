import { Student } from "../models/student.models.js";
import LoginStudent from "../models/loginStudent.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";

const registerStudent = async (req, res) => {
  // const response = req.body;

  // let studentData;
  // try {
  //   studentData =
  //     typeof response.studentData === "string"
  //       ? JSON.parse(response.studentData)
  //       : response.studentData;
  //   if (!studentData) {
  //     throw new ApiError(400, "Student data is missing from the request");
  //   }
  // } catch (error) {
  //   throw new ApiError(400, "Invalid Data");
  // }

  const {
    name,
    email,
    dob,
    schoolname,
    standard,
    contact,
    alternatecontact,
    guardianname,
    bloodgroup,
    address,
    pincode,
    hobby,
  } = req.body;
  if (
    [
      name,
      email,
      dob,
      schoolname,
      standard,
      contact,
      alternatecontact,
      guardianname,
      bloodgroup,
      address,
      pincode,
      hobby,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedStudent = await Student.findOne({ email });

  if (existedStudent) {
    throw new ApiError(409, "Student with email already exists");
  }

  const photo = req.files.profileimage[0];
  const photoLocalPath = photo.path;

  if (!photoLocalPath) {
    throw new ApiError(400, "Profile photo local path not found");
  }

  const profilephoto = await uploadOnCloudinary(photoLocalPath);
  if (!profilephoto) {
    throw new ApiError(400, "Profile photo is required");
  }

  const profileimage = profilephoto.url;

  const student = await Student.create({
    name,
    email,
    dob,
    schoolname,
    standard,
    contact,
    alternatecontact,
    guardianname,
    bloodgroup,
    address,
    pincode,
    hobby,
    profileimage,
  });

  const createdStudent = await Student.findById(student._id);
  if (!createdStudent) {
    throw new ApiError(500, "Something went wrong while registering");
  }
  return res.status(201).json(new ApiResponse(200, createdStudent, "student"));
};

// const studentLogin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     let user = await LoginStudent.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User does not exists" });
//     }
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     res.cookie("token", token, { httpOnly: true, secure: true });
//     return res.status(200).json({ message: "Login successful" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Server error");
//   }
// };
const studentLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    let user = await LoginStudent.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const studentSignup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    let user = await LoginStudent.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const securePassword = await bcrypt.hash(password, 10);

    user = await LoginStudent.create({
      username,
      email,
      password: securePassword,
    });

    await user.save();
    res.status(200).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const forgot = async (req, res) => {
  const { email } = req.body;
  try {
    const genrateOtp = Math.floor(1000 + Math.random() * 9000);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aniket.singh07vs@gmail.com",
        pass: "fidmnumrlsgcjfvm",
      },
    });

    const info = await transporter.sendMail({
      from: '"Maddison Foo👻" <aniket.singh07vs@gmail.com>',
      to: email,
      subject: "New OTP Generated",
      html: `<b>OTP is : <i>${genrateOtp}</i></b>`,
    });

    if (info.messageId) {
      let user = await LoginStudent.findOneAndUpdate(
        { email },
        { otp: genrateOtp },
        { new: true }
      );
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
    }
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { registerStudent, studentLogin, studentSignup, forgot };
