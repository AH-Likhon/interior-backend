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
exports.UserService = exports.getAllAdminFromDB = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constant_1 = require("./user.constant");
const user_utils_1 = require("./user.utils");
const createUserToDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.role && (data.role === "ADMIN" || data.role === "SUPER_ADMIN")) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please remove the user role");
    }
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already exist");
    }
    const hashPassword = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bcrypt_salt_rounds));
    data["password"] = hashPassword;
    const result = yield prisma_1.default.user.create({
        data,
    });
    return result;
});
const getAllUserFromDB = (filters, options, role) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map(field => ({
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
                    equals: filtersData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    if (role === "ADMIN") {
        return yield (0, user_utils_1.HandleSearchRole)("ADMIN", whereConditions, page, skip, limit, options);
    }
    else if (role === "SUPER_ADMIN") {
        return yield (0, user_utils_1.HandleSearchRole)("SUPER_ADMIN", whereConditions, page, skip, limit, options);
    }
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateSingleUserToDB = (id, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload, others = __rest(payload, ["email"]);
    if (others.password) {
        const hashPassword = yield bcrypt_1.default.hash(others.password, Number(config_1.default.bcrypt_salt_rounds));
        others["password"] = hashPassword;
    }
    if (role !== "SUPER_ADMIN") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please remove the role");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: others,
    });
    return result;
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    return result;
});
const getAllAdminFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            role: "ADMIN",
        },
    });
    return result;
});
exports.getAllAdminFromDB = getAllAdminFromDB;
const getMyProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateMyProfileToDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not exist");
    }
    if (data === null || data === void 0 ? void 0 : data.password) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please remove the password field");
    }
    if (data === null || data === void 0 ? void 0 : data.role) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please remove the role field");
    }
    if (data === null || data === void 0 ? void 0 : data.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please remove the email field");
    }
    const updateProfile = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data,
    });
    return updateProfile;
});
exports.UserService = {
    createUserToDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateSingleUserToDB,
    deleteUserFromDB,
    getAllAdminFromDB: exports.getAllAdminFromDB,
    getMyProfileFromDB,
    updateMyProfileToDB,
};
