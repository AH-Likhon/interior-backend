import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { paginationFields } from "../../../constants";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserService.createUserToDB(payload);
  sendResponse(res, {
    success: true,
    message: "User Created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await UserService.getAllUserFromDB(filters, options);
  sendResponse(res, {
    success: true,
    message: "Fetched users successfully",
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUserFromDB(id);
  sendResponse(res, {
    success: true,
    message: "Fetched single user successfully",
    statusCode: httpStatus.OK,

    data: result,
  });
});

const updateSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await UserService.updateSingleUserToDB(id, payload);
  sendResponse(res, {
    success: true,
    message: "Updated single user successfully",
    statusCode: httpStatus.OK,

    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserService.deleteUserFromDB(id);
  sendResponse(res, {
    success: true,
    message: "User deleted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteUser,
};
