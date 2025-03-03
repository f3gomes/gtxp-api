import { Request, Response } from "express";
import { Post } from "@prisma/client";
import postService from "../services/post.service";

const postController = async (
  req: Request,
  res: Response
): Promise<Post | any> => {
  try {
    const post = await postService.createPost(req.body);

    return res.status(201).json({ post });
  } catch (error: any) {
    const errorMessages = error.message.split("\n");
    const lastErrorMessage = errorMessages[errorMessages.length - 1];

    res.status(500).json({ error: lastErrorMessage });
    console.log(error);
  }
};

const getPosts = async (req: Request, res: Response): Promise<Post[] | any> => {
  try {
    const posts = await postService.getAllPosts();

    return res.status(200).json({ posts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const getPostsByEmail = async (
  req: Request,
  res: Response
): Promise<Post[] | any> => {
  const { email } = req.body;

  try {
    const posts = await postService.getPostByEmail(email);

    return res.status(200).json({ posts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export default {
  getPosts,
  postController,
  getPostsByEmail,
};
