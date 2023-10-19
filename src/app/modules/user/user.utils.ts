/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../../shared/prisma";

export const HandleSearchRole = async (
  role: string,
  whereConditions: any,
  page: number,
  skip: number,
  limit: number,
  options: any,
) => {
  const result = await prisma.user.findMany({
    where:
      role === "ADMIN"
        ? { ...whereConditions, role: "CUSTOMER" }
        : whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.user.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
