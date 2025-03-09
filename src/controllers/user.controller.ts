import nodemailer from "nodemailer";
import { Request, Response } from "express";

import { User } from "@prisma/client";

import userService from "../services/user.service";
import {
  confirmTemplate,
  generateEmail,
  generateEmailResetPassword,
} from "../templates/confirm.email";

const getUserById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await userService.findUserById(id);

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const { password, ...rest } = user;
    const updatedUser = rest;

    return res.status(200).json({ updatedUser });
  } catch (error: any) {
    const errorMessages = error.message.split("\n");
    const lastErrorMessage = errorMessages[errorMessages.length - 1];

    return res.status(500).json({ error: lastErrorMessage });
  }
};

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
    const url = `${process.env.BASE_URL_API}/api/user/verify/${user.id}`;

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
          console.log("Email enviado: " + info.response);
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

const patchUser = async (req: Request, res: Response): Promise<User | any> => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(401)
      .json({ message: "Informe o e-mail para atualizar os dados" });
  }

  if (password) {
    return res.status(401).json({ message: "Senha não pode ser alterada" });
  }

  try {
    const user = await userService.updateUser(req.body);
    delete user.password;

    return res.status(200).json({ user });
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

const patchRequestResetPassword = async (
  req: Request,
  res: Response
): Promise<Object | any> => {
  const { email } = req.body;

  try {
    const token = await userService.requestPasswordReset(email);

    const user = await userService.findUserByEmail(email);
    const url = `${process.env.BASE_URL_APP}/reset/${user?.id}`;

    const html = await generateEmailResetPassword(user?.name as string, url);

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
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de senha",
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

    return res.status(201).json({
      message: "Verifique seu e-mail para alterar sua senha",
      email,
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const patchResetPassword = async (
  req: Request,
  res: Response
): Promise<Object | any> => {
  const { token, password } = req.body;

  try {
    await userService.resetPassword(token, password);

    return res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  patchRequestResetPassword,
  patchResetPassword,
  getVerifyUserEmail,
  getUserById,
  patchUser,
  postUser,
  getUsers,
  login,
};
