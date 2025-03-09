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
userRouter.get("/user/:id", userController.getUserById);

userRouter.patch("/user/edit", middleware.auth, userController.patchUser);
userRouter.patch(
  "/user/reset/request",
  userController.patchRequestResetPassword
);

userRouter.patch(
  "/user/reset/:id",
  validateData(userSchemaResetPasword),
  userController.patchResetPassword
);
