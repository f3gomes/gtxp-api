import express from "express";
import middleware from "../middlewares/auth";
import userController from "../controllers/user.controller";
import { userSchema, userSchemaResetPasword } from "../schemas/user.schema";
import { validateData } from "../middlewares/validation";

export const userRouter = express.Router();

userRouter.post("/login", userController.login);
userRouter.post("/user/new", validateData(userSchema), userController.postUser);

userRouter.get("/user/list", middleware.auth, userController.getUsers);
userRouter.get("/user/verify/:id", userController.getVerifyUserEmail);

userRouter.patch(
  "/user/reset/:id",
  validateData(userSchemaResetPasword),
  userController.patchResetPassword
);
