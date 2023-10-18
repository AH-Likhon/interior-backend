import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  //   const id = req.params.id
  const payload = req.body;
  const result = await BookingService.createBookingToDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking created successfully",

    data: result,
  });
});

export const BookingController = {
  createBooking,
};
