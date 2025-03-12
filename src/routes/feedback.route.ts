import express from "express";
import middleware from "../middlewares/auth";
import feedbackController from "../controllers/feedback.controller";
import { feedbackSchema } from "../schemas/feedback.schema";
import { validateData } from "../middlewares/validation";

export const feedbackRouter = express.Router();

feedbackRouter.get(
  "/feedbacks/list",
  middleware.auth,
  feedbackController.getFeedbacks
);
feedbackRouter.get(
  "/feedbacks/list/email",
  middleware.auth,
  feedbackController.getFeedbackByEmail
);

feedbackRouter.post(
  "/feedbacks/new",
  middleware.auth,
  validateData(feedbackSchema),
  feedbackController.postFeedback
);
