import express from "express";
import userController from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.post("/user/new", userController.postUser);
userRouter.get("/user/list", userController.getUsers);
userRouter.post("/login", userController.login);
