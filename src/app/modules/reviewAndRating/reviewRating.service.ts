/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

const findReviewFromDB = async (id: string, serviceId: string) => {
  const reviewExistOrNot = await prisma.reviewsRating.findFirst({
    where: {
      serviceId,
      userId: id,
    },
  });
  // if (reviewExistOrNot) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'User already reviewed')
  // }
  return reviewExistOrNot ? true : false;
};

const insertReviewToDB = async (
  id: string,
  serviceId: string,
  reviewData: any,
) => {
  const isBookedOrNot = await prisma.booking.findFirst({
    where: {
      userId: id,
    },
  });

  if (!isBookedOrNot) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Need to book the service first",
    );
  }
  const reviewExistOrNot = await prisma.reviewsRating.findFirst({
    where: {
      serviceId,
      userId: id,
    },
  });
  if (reviewExistOrNot) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already reviewed");
  }

  reviewData["userId"] = id;
  reviewData["serviceId"] = serviceId;
  const result = await prisma.reviewsRating.create({
    data: reviewData,
  });

  return result;
};

const getAllReviewFromDB = async () => {
  const result = await prisma.reviewsRating.findMany({
    where: {},
    include: {
      service: true,
      users: true,
    },
  });

  return result;
};

export const ReviewRatingService = {
  insertReviewToDB,
  findReviewFromDB,
  getAllReviewFromDB,
};
