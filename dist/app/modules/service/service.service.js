"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteriorService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const service_constant_1 = require("./service.constant");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createServiceToDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.service.create({
        data,
    });
    return result;
});
const getAllServicesFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: service_constant_1.serviceSearchableFields.map(field => ({
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
                }
                else if (field === "maxPrice" && filtersData.maxPrice) {
                    return {
                        price: {
                            lte: parseFloat(filtersData.maxPrice),
                        },
                    };
                }
                else {
                    return {
                        [field]: {
                            equals: filtersData[field],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.service.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: { reviewsRatings: true },
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.service.count({ where: whereConditions });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleServiceFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.service.findUnique({
        where: {
            id,
        },
        include: { reviewsRatings: true },
    });
    return result;
});
const updateSingleServiceToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.service.update({
        where: {
            id,
        },
        include: { reviewsRatings: true },
        data: payload,
    });
    return result;
});
const deleteSingleServiceFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingOrNot = yield prisma_1.default.booking.findFirst({
        where: {
            serviceId: id,
        },
    });
    if (bookingOrNot) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You can't delete this service, as this service already booking information");
    }
    const result = yield prisma_1.default.service.delete({
        where: {
            id,
        },
    });
    return result;
});
const getByCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueCategories = yield prisma_1.default.service.findMany({
        distinct: ["category"],
        select: {
            category: true,
        },
    });
    const uniqueCategoryData = [];
    for (const categoryInfo of uniqueCategories) {
        const result = yield prisma_1.default.service.findFirst({
            where: {
                category: categoryInfo.category,
            },
        });
        if (result) {
            uniqueCategoryData.push(result);
        }
    }
    return uniqueCategoryData;
});
exports.InteriorService = {
    createServiceToDB,
    getAllServicesFromDB,
    getSingleServiceFromDB,
    updateSingleServiceToDB,
    deleteSingleServiceFromDB,
    getByCategoryFromDB,
};
