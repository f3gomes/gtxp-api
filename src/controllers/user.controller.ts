import { Request, Response } from "express";
import { User } from "@prisma/client";
import { sendMail } from "../utils/send.email";
import {
  generateEmail,
  confirmSuccessTemplate,
} from "../templates/confirm.email";
import userService from "../services/user.service";

const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "usuário não encontrado" });
    }

    const isPasswordMatch = await userService.comparePasswords(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "senha incorreta" });
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
    const url = `${process.env.BASE_URL}/api/user/verify/${user.id}`;

    const html = generateEmail(user?.name, url);

    await sendMail({
      email: user?.email,
      subject: "Verifique seu e-mail",
      html,
    });

    delete user.password;

    return res.status(201).json({ verify: url, user });
  } catch (error: any) {
    const errorMessages = error.message.split("\n");
    const lastErrorMessage = errorMessages[errorMessages.length - 1];

    res.status(500).json({ error: lastErrorMessage });
    console.log(error);
  }
};

const getUsers = async (req: Request, res: Response): Promise<User[] | any> => {
  try {
    const usersList: any = await userService.getUsersList();

    const { users } = usersList;
    const updatedList = users?.map(({ password, ...rest }: User) => rest);

    return res.status(200).json({ updatedList });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const getVerifyUserEmail = async (
  req: Request,
  res: Response
): Promise<Object | any> => {
  const { id } = req.params;

  try {
    await userService.verifyUserEmail(id);

    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(confirmSuccessTemplate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

const patchResetPassword = async (
  req: Request,
  res: Response
): Promise<Object | any> => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const userUpdated = await userService.resetPassword(id, password);

    return res
      .status(200)
      .json({ message: "senha alterada com sucesso", email: userUpdated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export default {
  patchResetPassword,
  getVerifyUserEmail,
  postUser,
  getUsers,
  login,
};
