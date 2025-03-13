import { PrismaClient } from "@prisma/client";

const prisma: any = new PrismaClient();

const createFeedback = async (data: any): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email, visible: true },
  });

  if (!user) {
    throw new Error("usuário não encontrado");
  }

  if (!user?.verified) {
    throw new Error("e-mail não verificado");
  }

  const feedback = await prisma.feedback.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
      user: {
        connect: { id: user?.id },
      },
    },
  });

  return feedback;
};

const getFeedbackByEmail = async (email: string): Promise<any[]> => {
  const feedbacks = await prisma.feedback.findMany({
    where: {
      email,
    },
  });

  return feedbacks;
};

const getAllFeedbacks = async (): Promise<any[]> => {
  const feedbacks = await prisma.feedback.findMany();

  return feedbacks;
};

export default {
  createFeedback,
  getAllFeedbacks,
  getFeedbackByEmail,
};
