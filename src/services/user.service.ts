import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

async function comparePasswords(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

async function generateToken(user: User) {
  return jwt.sign({ userId: user.id }, "cbgplsupersecret", { expiresIn: "1d" });
}

const createUser = async (data: User): Promise<any> => {
  const userLength = (await prisma.user.count()) + 1;
  const startId = userLength.toString().padStart(5, "0");

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const updatedData = {
    ...data,
    password: hashedPassword,
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
  findUserByEmail,
  comparePasswords,
  generateToken,
};
