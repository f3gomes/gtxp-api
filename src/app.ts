import cors from "cors";
import { userRouter } from "./routes/user.route";
import { postRouter } from "./routes/post.route";
import { feedbackRouter } from "./routes/feedback.route";
import { appointmentRouter } from "./routes/appointment.route";
import express, { Application, Request, Response } from "express";

const app: Application = express();

const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "API is on!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", feedbackRouter);
app.use("/api", appointmentRouter);

export default app;

// reset 16-03-2025
