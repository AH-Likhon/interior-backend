import { Booking } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createBookingToDB = async (data: Booking) => {
  const checkAlreadyBookDate = await prisma.booking.findFirst({
    where: {
      date: data.date,
    },
  });

  if (checkAlreadyBookDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "On this day book already confirmed",
    );
  }

  const result = await prisma.booking.create({
    data,
    include: {
      service: true,
      user: true,
    },
  });
  return result;
};

export const BookingService = {
  createBookingToDB,
};
