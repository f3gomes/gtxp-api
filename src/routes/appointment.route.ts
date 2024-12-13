import express from "express";
import middleware from "../middlewares/auth";
import appointmentController from "../controllers/appointment.controller";
import { appointmentSchema } from "../schemas/appointment.schema";
import { validateData } from "../middlewares/validation";

export const appointmentRouter = express.Router();

appointmentRouter.post(
  "/appointment/new",
  middleware.auth,
  validateData(appointmentSchema),
  appointmentController.postAppointment
);
