import express from "express";
import middleware from "../middlewares/auth";
import userController from "../controllers/user.controller";
import { userSchema } from "../schemas/userSchema";
import { validateData } from "../middlewares/validation";

export const userRouter = express.Router();

userRouter.post("/user/new", validateData(userSchema), userController.postUser);
userRouter.get("/user/list", middleware.auth, userController.getUsers);
userRouter.post("/login", userController.login);
