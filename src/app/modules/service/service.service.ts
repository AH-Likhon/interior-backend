import { Service } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createServiceToDB = async (data: Service) => {
  const result = await prisma.service.create({
    data,
  });
  return result;
};

export const InteriorService = {
  createServiceToDB,
};
