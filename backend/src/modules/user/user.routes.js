import express from "express";
import { signin, signup } from "./user.controller.js";
import { signinSchema, signupSchema, validate } from "../../middleware/validation.js";


const userRouter = express.Router();

userRouter.post("/signup", validate(signupSchema), signup);
userRouter.post("/signin", validate(signinSchema), signin);

export default userRouter;