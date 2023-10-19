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
exports.ServiceController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const service_service_1 = require("./service.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const service_constant_1 = require("./service.constant");
const constants_1 = require("../../../constants");
const createService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield service_service_1.InteriorService.createServiceToDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "New Service created successfully",
        data: result,
    });
}));
const getAllServices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.query, "checking query");
    const filters = (0, pick_1.default)(req.query, service_constant_1.serviceFilterableFields);
    const options = (0, pick_1.default)(req.query, constants_1.paginationFields);
    const result = yield service_service_1.InteriorService.getAllServicesFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Fetched all services successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield service_service_1.InteriorService.getSingleServiceFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Fetched single service successfully",
        data: result,
    });
}));
const updateSingleService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const result = yield service_service_1.InteriorService.updateSingleServiceToDB(id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Single service updated successfully",
        data: result,
    });
}));
const deleteSingleService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield service_service_1.InteriorService.deleteSingleServiceFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Single service deleted successfully",
        data: result,
    });
}));
exports.ServiceController = {
    createService,
    getAllServices,
    getSingleService,
    updateSingleService,
    deleteSingleService,
};
