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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data.email);
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const userPassword = user.password;
    const givenPassword = data.password;
    const isPasswordMatched = yield bcrypt_1.default.compare(givenPassword, userPassword);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password does not matched");
    }
    const JwtPayloadData = {
        id: user.id,
        role: user.role,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(JwtPayloadData, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(JwtPayloadData, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const addAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const updateUserRole = yield prisma_1.default.user.update({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
        data: {
            role: "ADMIN",
        },
    });
    return updateUserRole;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid Refresh Token");
    }
    const { id } = verifiedToken;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    //generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: user.id,
        role: user.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (id, previousPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const userPassword = isExist.password;
    // const givenPassword = data.password
    const isPasswordMatched = yield bcrypt_1.default.compare(previousPassword, userPassword);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password not matched");
    }
    const bcryptPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            password: bcryptPassword,
        },
    });
    return result;
});
exports.AuthService = {
    loginUser,
    addAdmin,
    refreshToken,
    changePassword,
};
