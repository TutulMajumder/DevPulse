import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user?.id;
    // console.log(reporter_id);
    const result = await issueService.createIssueToDB(req.body, reporter_id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Something Went Wrong!",
      errors: error,
    });
  }
};

const getAllIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssueFromDB(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Something Went Wrong!",
      errors: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.getSingleIssueFromDB(id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Something Went Wrong!",
      errors: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reporter_id = req.user?.id;
    const role = req.user?.role;
    const result = await issueService.updateIssueToDB(
      id as string,
      reporter_id,
      role,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Something Went Wrong!",
      errors: error,
    });
  }
};
const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = req.user?.role;
    const result = await issueService.deleteIssueToDB(id as string, role);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Something Went Wrong!",
      errors: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
