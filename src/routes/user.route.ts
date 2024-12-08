import express from "express";
import middleware from "../middlewares/auth";
import userController from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.post("/user/new", userController.postUser);
userRouter.get("/user/list", middleware.auth, userController.getUsers);
userRouter.post("/login", userController.login);
