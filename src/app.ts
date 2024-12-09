import cors from "cors";
import { userRouter } from "./routes/user.route";
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

export default app;
