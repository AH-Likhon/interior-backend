/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ReviewRatingService } from "./reviewRating.service";

const insertReview = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const { id } = req.user as any;
  const payload = req.body;
  const result = await ReviewRatingService.insertReviewToDB(
    id,
    serviceId,
    payload,
  );

  sendResponse(res, {
    success: true,
    message: "Review added successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const findReview = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const { id } = req.user as any;
  const result = await ReviewRatingService.findReviewFromDB(id, serviceId);

  sendResponse(res, {
    success: true,
    message: "Review fetched successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewRatingService.getAllReviewFromDB();

  sendResponse(res, {
    success: true,
    message: "Review fetched successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const ReviewRatingController = {
  insertReview,
  findReview,
  getAllReview,
};
