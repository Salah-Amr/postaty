import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./src/modules/user/user.routes.js";
import postRouter from "./src/modules/post/post.routes.js";
import { conn } from "./database/dbconnection.js";
import cors from "cors";

const App = express();
const Port = process.env.PORT;

App.use(express.json());
App.use(cors());
App.use("/user", userRouter);
App.use("/posts", postRouter);

App.get("/", (req, res) => res.send("Posts Management API is running"));

conn();

App.listen(Port);