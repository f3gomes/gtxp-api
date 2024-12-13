import { Request, Response } from "express";
import { Appointment } from "@prisma/client";
import appointmentService from "../services/appointment.service";

const postAppointment = async (
  req: Request,
  res: Response
): Promise<Appointment | any> => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);

    return res.status(201).json({ appointment });
  } catch (error: any) {
    const errorMessages = error.message.split("\n");
    const lastErrorMessage = errorMessages[errorMessages.length - 1];

    res.status(500).json({ error: lastErrorMessage });
    console.log(error);
  }
};

export default {
  postAppointment,
};
