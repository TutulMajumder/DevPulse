import config from "../../config";
import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUserToDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);

  const results = await pool.query(
    `
        INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,COALESCE($4,'contributor'))
        RETURNING *
        `,
    [name, email, hashPassword, role],
  );
  delete results.rows[0].password;
  return results;
};

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );
  //   console.log(userData);

  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userData.rows[0];
  //   console.log(user);
  const matchPassword = await bcrypt.compare(password, user.password);
  //   console.log(matchPassword);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  delete userData.rows[0].password;

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.access_secret as string, {
    expiresIn: "1d",
  });
  return { token, user };
};

export const userService = {
  registerUserToDB,
  loginUserFromDB,
};
