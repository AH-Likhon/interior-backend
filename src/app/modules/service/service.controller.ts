import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { InteriorService } from "./service.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createService = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await InteriorService.createServiceToDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New Service created successfully",
    data: result,
  });
});

export const ServiceController = {
  createService,
};
