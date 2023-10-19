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
exports.BookingService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const booking_constant_1 = require("./booking.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createBookingToDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const checkAlreadyBookDate = yield prisma_1.default.booking.findFirst({
        where: {
            date: data.date,
        },
    });
    if (checkAlreadyBookDate) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "On this day book already confirmed");
    }
    const result = yield prisma_1.default.booking.create({
        data,
        include: {
            service: true,
            user: true,
        },
    });
    return result;
});
const getAllBookingFromDB = (user, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { role, id } = user;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: booking_constant_1.bookingSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => ({
                [key]: {
                    equals: filtersData[key],
                },
            })),
        });
    }
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
        const result = yield prisma_1.default.booking.findMany({
            include: {
                user: true,
                service: true,
            },
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: "desc",
                },
        });
        const total = yield prisma_1.default.booking.count({
            where: whereConditions,
        });
        return {
            meta: {
                total,
                page,
                limit,
            },
            data: result,
        };
    }
    else if (role === "CUSTOMER") {
        const result = yield prisma_1.default.booking.findMany({
            where: {
                user: {
                    id,
                },
            },
            include: {
                user: true,
                service: true,
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: "desc",
                },
        });
        return {
            meta: {
                total: result.length,
                page,
                limit,
            },
            data: result,
        };
    }
});
const getSingleBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            service: true,
        },
    });
    return result;
});
const updateBookingStatusToDB = (id, status, date) => __awaiter(void 0, void 0, void 0, function* () {
    const findBooking = yield prisma_1.default.booking.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
            service: true,
        },
    });
    // console.log(date);
    if (status || date.length > 0) {
        if ((findBooking === null || findBooking === void 0 ? void 0 : findBooking.bookingStatus) === "confirm" ||
            ((findBooking === null || findBooking === void 0 ? void 0 : findBooking.bookingStatus) === "cancel" && status === "pending")) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "only able to change the status from pending to confirm or cancel");
        }
        return yield prisma_1.default.booking.update({
            where: { id },
            data: {
                bookingStatus: status ? status : "pending",
                date: date ? date : findBooking === null || findBooking === void 0 ? void 0 : findBooking.date,
            },
        });
    }
    //  else {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'only able to change the status from pending to confirm or cancel',
    //   )
    // }
    // }
});
const deleteBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.delete({
        where: { id },
    });
    return;
    result;
});
exports.BookingService = {
    createBookingToDB,
    getAllBookingFromDB,
    getSingleBookingFromDB,
    updateBookingStatusToDB,
    deleteBookingFromDB,
};
