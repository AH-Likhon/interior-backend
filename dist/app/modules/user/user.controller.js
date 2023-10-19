"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from "express";
// import catchAsync from "../../../shared/catchAsync";
// import { UserService } from "./user.service";
// import sendResponse from "../../../shared/sendResponse";
// import httpStatus from "http-status";
// import pick from "../../../shared/pick";
// import { userFilterableFields } from "./user.constant";
// import { paginationFields } from "../../../constants";
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
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const user_constant_1 = require("./user.constant");
const constants_1 = require("../../../constants");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield user_service_1.UserService.createUserToDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User Created successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.user;
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, constants_1.paginationFields);
    const result = yield user_service_1.UserService.getAllUserFromDB(filters, options, role);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Fetched users successfully",
        statusCode: http_status_1.default.OK,
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserService.getSingleUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Fetched single user successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getAllAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllAdminFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Fetched all admin  successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const updateSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { role } = req.user;
    const id = req.params.id;
    const payload = req.body;
    const result = yield user_service_1.UserService.updateSingleUserToDB(id, role, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Updated single user successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserService.deleteUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User deleted successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield user_service_1.UserService.getMyProfileFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "My profile fetched successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = req.user;
    const data = req.body;
    const result = yield user_service_1.UserService.updateMyProfileToDB(id, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "My profile updated successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
exports.UserController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateSingleUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
    getAllAdmin,
};
