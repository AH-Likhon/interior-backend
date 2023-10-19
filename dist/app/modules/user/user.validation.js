"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const validateCreateUser = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email(),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        contactNo: zod_1.z.string({
            required_error: 'ContactNo. is required',
        }),
        address: zod_1.z.string({
            required_error: 'Address is required',
        }),
        ProfileImage: zod_1.z
            .string({
            required_error: 'ContactNo. is required',
        })
            .optional(),
    }),
});
const updateUser = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .optional(),
        contactNo: zod_1.z
            .string({
            required_error: 'ContactNo. is required',
        })
            .optional(),
        address: zod_1.z
            .string({
            required_error: 'Address is required',
        })
            .optional(),
        ProfileImage: zod_1.z
            .string({
            required_error: 'ContactNo. is required',
        })
            .optional(),
    }),
});
exports.UserValidation = { validateCreateUser, updateUser };
