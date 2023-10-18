import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { InteriorService } from "./service.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { serviceFilterableFields } from "./service.constant";
import { paginationFields } from "../../../constants";

const createService = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await InteriorService.createService(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, serviceFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await InteriorService.getAllServicesFromDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Fetched all services successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await InteriorService.getSingleServiceFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Fetched single services successfully",

    data: result,
  });
});

const updateSingleService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await InteriorService.updateSingleServiceFromDB(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single service updated successfully",

    data: result,
  });
});

export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
  updateSingleService,
};
