import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async (data: User): Promise<any> => {
  const userLength = (await prisma.user.count()) + 1;
  const startId = userLength.toString().padStart(5, "0");

  const updatedData = {
    ...data,
    pmiId: "CBGPL25" + startId,
  };

  return prisma.user.create({ data: updatedData });
};

const getUsersList = async (): Promise<Object> => {
  const users = await prisma.user.findMany({ where: { visible: true } });

  const total = users.length;

  const usersList = { total, users };

  return usersList;
};

export default {
  createUser,
  getUsersList,
};
