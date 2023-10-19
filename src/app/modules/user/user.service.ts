/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import { HandleSearchRole } from "./user.utils";

const createUserToDB = async (data: User) => {
  if (data.role && (data.role === "ADMIN" || data.role === "SUPER_ADMIN")) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please remove the user role");
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exist");
  }

  const hashPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds),
  );
  data["password"] = hashPassword;

  const result = await prisma.user.create({
    data,
  });
  return result;
};

const getAllUserFromDB = async (
  filters: any,
  options: IPaginationOptions,
  role: string,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  if (role === "ADMIN") {
    return await HandleSearchRole(
      "ADMIN",
      whereConditions,
      page,
      skip,
      limit,
      options,
    );
  } else if (role === "SUPER_ADMIN") {
    return await HandleSearchRole(
      "SUPER_ADMIN",
      whereConditions,
      page,
      skip,
      limit,
      options,
    );
  }
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSingleUserToDB = async (
  id: string,
  role: string,
  payload: Partial<User>,
) => {
  const { email, ...others } = payload;

  if (others.password) {
    const hashPassword = await bcrypt.hash(
      others.password,
      Number(config.bcrypt_salt_rounds),
    );
    others["password"] = hashPassword;
  }

  if (role !== "SUPER_ADMIN") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please remove the role");
  }
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: others,
  });
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const getAllAdminFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });
  return result;
};

const getMyProfileFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateMyProfileToDB = async (id: string, data: Partial<User>) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not exist");
  }
  if (data?.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please remove the password field",
    );
  }
  if (data?.role) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please remove the role field");
  }
  if (data?.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please remove the email field");
  }
  const updateProfile = await prisma.user.update({
    where: {
      id,
    },
    data,
  });
  return updateProfile;
};

export const UserService = {
  createUserToDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateSingleUserToDB,
  deleteUserFromDB,
  getAllAdminFromDB,
  getMyProfileFromDB,
  updateMyProfileToDB,
};
