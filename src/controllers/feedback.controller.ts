import { Request, Response } from "express";
import feedbackService from "../services/feedback.service";

const postFeedback = async (req: Request, res: Response): Promise<any> => {
  try {
    const feedback = await feedbackService.createFeedback(req.body);

    return res.status(201).json({ feedback });
  } catch (error: any) {
    const errorMessages = error.message.split("\n");
    const lastErrorMessage = errorMessages[errorMessages.length - 1];

    res.status(500).json({ error: lastErrorMessage });
    console.log(error);
  }
};

const getFeedbackByEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;

  try {
    const feedback = await feedbackService.getFeedbackByEmail(email);

    return res.status(200).json({ feedback });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const getFeedbacks = async (req: Request, res: Response): Promise<any> => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();

    return res.status(200).json({ feedbacks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export default {
  getFeedbacks,
  postFeedback,
  getFeedbackByEmail,
};
