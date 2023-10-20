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
  const result = await InteriorService.createServiceToDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query, "checking query");
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
  const result = await InteriorService.updateSingleServiceToDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single service updated successfully",
    data: result,
  });
});

const deleteSingleService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await InteriorService.deleteSingleServiceFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single service deleted successfully",
    data: result,
  });
});

const getByCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await InteriorService.getByCategoryFromDB();
  // console.log('checking from category', result)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category data fetched successfully",
    data: result,
  });
});

export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
  updateSingleService,
  deleteSingleService,
  getByCategory,
};
