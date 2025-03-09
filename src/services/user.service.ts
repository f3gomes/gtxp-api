import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET_KEY!;

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
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

const updateUser = async (data: User): Promise<any> => {
  const { email } = data;

  const user = findUserByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (user) {
    await prisma.user.update({
      where: {
        email,
      },

      data,
    });

    return user;
  }
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

const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  try {
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

    if (user) {
      await prisma.user.update({
        where: {
          email,
        },

        data: {
          resetToken: token,
        },
      });
    }

    return token;
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (token: string, newPassword: string) => {
  let decoded;

  try {
    decoded = jwt.decode(token) as { userId: string };
    if (!decoded) {
      throw new Error("Token inválido");
    }
  } catch {
    throw new Error("Token inválido");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const secret = process.env.JWT_SECRET + user.password;

  try {
    jwt.verify(token, secret);
  } catch {
    throw new Error("Token expirado ou inválido");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return "Senha redefinida com sucesso!";
};

export default {
  createUser,
  updateUser,
  findUserById,
  getUsersList,
  resetPassword,
  generateToken,
  findUserByEmail,
  verifyUserEmail,
  comparePasswords,
  requestPasswordReset,
};
