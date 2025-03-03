import { Appointment, User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createAppointment = async (data: Appointment): Promise<any> => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });

  if (!user) {
    throw new Error("user not found");
  }

  const appointment = await prisma.appointment.create({
    data: {
      description: data.description,
      local: data.local,
      limit: data.limit,
      date: data.date,
      user: {
        connect: { id: user?.id },
      },
    },
  });

  return appointment;
};

export default {
  createAppointment,
};
