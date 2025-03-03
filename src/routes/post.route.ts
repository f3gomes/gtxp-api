import express from "express";
import middleware from "../middlewares/auth";
import postController from "../controllers/post.controller";
import { postSchema } from "../schemas/post.schema";
import { validateData } from "../middlewares/validation";

export const postRouter = express.Router();

postRouter.get("/posts/list", middleware.auth, postController.getPosts);
postRouter.get(
  "/posts/list/email",
  middleware.auth,
  postController.getPostsByEmail
);

postRouter.post(
  "/posts/new",
  middleware.auth,
  validateData(postSchema),
  postController.postController
);
