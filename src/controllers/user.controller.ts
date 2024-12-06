import { Request, Response } from "express";
import { User } from "@prisma/client";
import userService from "../services/user.service";

const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const isPasswordMatch = await userService.comparePasswords(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = await userService.generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const postUser = async (req: Request, res: Response): Promise<User | any> => {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json({ user });
  } catch (error: any) {
    const errorMessages = error.message.split("\n");
    const lastErrorMessage = errorMessages[errorMessages.length - 1];

    res.status(500).json({ error: lastErrorMessage });
    console.log(error);
  }
};

const getUsers = async (req: Request, res: Response): Promise<User[] | any> => {
  try {
    const usersList = await userService.getUsersList();

    return res.status(200).json({ usersList });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export default {
  postUser,
  getUsers,
  login,
};
