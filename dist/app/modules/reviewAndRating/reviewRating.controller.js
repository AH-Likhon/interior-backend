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
exports.ReviewRatingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const reviewRating_service_1 = require("./reviewRating.service");
const insertReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceId = req.params.id;
    const { id } = req.user;
    const payload = req.body;
    const result = yield reviewRating_service_1.ReviewRatingService.insertReviewToDB(id, serviceId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Review added successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const findReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceId = req.params.id;
    const { id } = req.user;
    const result = yield reviewRating_service_1.ReviewRatingService.findReviewFromDB(id, serviceId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Review fetched successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getAllReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewRating_service_1.ReviewRatingService.getAllReviewFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Review fetched successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
exports.ReviewRatingController = {
    insertReview,
    findReview,
    getAllReview,
};
