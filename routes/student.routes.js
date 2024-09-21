import express from "express";
import { forgot, registerStudent, studentLogin, studentSignup } from "../controllers/studentRegister.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profileimage",
      maxCount: 1,
    },
  ]),
  registerStudent
);

router.post('/login', studentLogin);
router.post('/signup', studentSignup);
router.post('/forgot', forgot)

export default router;
