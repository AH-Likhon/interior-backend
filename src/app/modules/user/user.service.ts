import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createUser = async (data: User) => {
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

export const UserService = {
  createUser,
};
