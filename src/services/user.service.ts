import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET_KEY!;

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const comparePasswords = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = async (user: User) => {
  return jwt.sign({ userId: user.id }, secret, { expiresIn: "1d" });
};

const createUser = async (data: User): Promise<any> => {
  const userLength = (await prisma.user.count()) + 1;
  const startId = userLength.toString().padStart(5, "0");

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const updatedData = {
    ...data,
    password: hashedPassword,
    congressId: "CBGPL25" + startId,
  };

  return prisma.user.create({ data: updatedData });
};

const getUsersList = async (): Promise<Object> => {
  const users = await prisma.user.findMany({ where: { visible: true } });

  const total = users.length;

  const usersList = { total, users };

  return usersList;
};

const verifyUserEmail = async (id: string): Promise<String | undefined> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (user) {
    await prisma.user.update({
      where: {
        id,
      },

      data: {
        verified: true,
      },
    });

    return user.email;
  }
};

const resetPassword = async (id: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  if (user) {
    await prisma.user.update({
      where: {
        id,
      },

      data: {
        password: hashedPassword,
      },
    });

    return user.email;
  }
};

export default {
  createUser,
  getUsersList,
  findUserByEmail,
  comparePasswords,
  generateToken,
  verifyUserEmail,
  resetPassword,
};
