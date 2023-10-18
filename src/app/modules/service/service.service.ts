/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { serviceSearchableFields } from "./service.constant";

const createService = async (data: Service) => {
  const result = await prisma.service.create({
    data,
  });
  return result;
};

const getAllServicesFromDB = async (
  filters: any,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(field => {
        if (field === "minPrice" && filtersData.minPrice) {
          return {
            price: {
              gte: parseFloat(filtersData.minPrice),
            },
          };
        } else if (field === "maxPrice" && filtersData.maxPrice) {
          return {
            price: {
              lte: parseFloat(filtersData.maxPrice),
            },
          };
        } else {
          return {
            [field]: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              equals: (filtersData as any)[field],
            },
          };
        }
      }),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: { reviewsRatings: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.service.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleServiceFromDB = async (id: string) => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
    include: { reviewsRatings: true },
  });
  return result;
};

const updateSingleServiceToDB = async (
  id: string,
  payload: Partial<Service>,
) => {
  const result = await prisma.service.update({
    where: {
      id,
    },
    include: { reviewsRatings: true },
    data: payload,
  });
  return result;
};

const deleteSingleServiceFromDB = async (id: string) => {
  const result = await prisma.service.delete({
    where: {
      id,
    },
  });
  return result;
};

export const InteriorService = {
  createService,
  getAllServicesFromDB,
  getSingleServiceFromDB,
  updateSingleServiceToDB,
  deleteSingleServiceFromDB,
};
