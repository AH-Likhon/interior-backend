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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRatingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertReview = (id, serviceId, reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookedOrNot = yield prisma_1.default.booking.findFirst({
        where: {
            userId: id,
        },
    });
    if (!isBookedOrNot) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Need to book the service first");
    }
    const reviewExistOrNot = yield prisma_1.default.reviewsRating.findFirst({
        where: {
            serviceId,
            userId: id,
        },
    });
    // console.log(reviewExistOrNot, 'checking review exist or not')
    reviewData["userId"] = id;
    reviewData["serviceId"] = serviceId;
    // console.log(reviewData)
    if (reviewExistOrNot) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already reviewed");
    }
    const result = yield prisma_1.default.reviewsRating.create({
        data: reviewData,
    });
    return result;
});
exports.ReviewRatingService = { insertReview };
