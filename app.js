import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import "dotenv/config";
import studentRouter from "./routes/student.routes.js";

const app = express();

app.use(
  cors({
    origin: 'https://www.raventutorials.in',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());


app.use("/", studentRouter);

export default app;
