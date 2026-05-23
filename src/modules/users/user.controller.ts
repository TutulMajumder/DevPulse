import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const registerUser = async (req: Request, res: Response) => {
  try {
    const results = await userService.registerUserToDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: results.rows[0],
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something Went Wrong!",
      errors: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.loginUserFromDB(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something Went Wrong!",
      errors: error,
    });
  }
};

export const userController = {
  registerUser,
  loginUser,
};
