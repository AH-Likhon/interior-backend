"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string({
            required_error: "New password is required",
        }),
        previousPassword: zod_1.z.string({
            required_error: "Previous password is required",
        }),
    }),
});
exports.AuthValidation = { changePasswordZodSchema };
