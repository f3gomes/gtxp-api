import express from "express";
import middleware from "../middlewares/auth";
import userController from "../controllers/user.controller";
import { userSchema } from "../schemas/user.schema";
import { validateData } from "../middlewares/validation";

export const userRouter = express.Router();

userRouter.post("/login", userController.login);
userRouter.post("/user/new", validateData(userSchema), userController.postUser);

userRouter.get("/user/list", middleware.auth, userController.getUsers);
userRouter.get("/user/verify/:id", userController.getVerifyUserEmail);

userRouter.patch("/user/reset/:id", userController.patchResetPassword);

userRouter.post("/user/mail", userController.postMail);
