import nodemailer from "nodemailer";
import userService from "../services/user.service";

import { User } from "@prisma/client";
import { Request, Response } from "express";
import { generateEmail, confirmTemplate } from "../templates/confirm.email";

const login = async (req: Request, res: Response): Promise<any> => {
  const { password } = req.body;

  try {
    const user = await userService.findUserByEmail(req.body.email);

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

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Confirme seu e-mail para entrar" });
    }

    const token = await userService.generateToken(user);
    const { name, email, profileImgUrl } = user;

    return res.json({ name, email, profileImgUrl, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const postUser = async (req: Request, res: Response): Promise<User | any> => {
  const { name, email } = req.body;

  try {
    const user = await userService.createUser(req.body);
    const url = `${process.env.BASE_URL}/api/user/verify/${user.id}`;

    const html = await generateEmail(name, url);
    delete user.password;

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_KEY,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Verifique seu e-mail",
      html,
    };

    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("servidor está pronto");
          resolve(success);
        }
      });
    });

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("email enviado: " + info.response);
          resolve(error);
        }
      });
    });

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
      .send(confirmTemplate);
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
      .json({ message: "Senha alterada com sucesso", email: userUpdated });
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
