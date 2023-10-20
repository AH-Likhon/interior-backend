"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const service_controller_1 = require("./service.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), service_controller_1.ServiceController.createService);
router.get("/", service_controller_1.ServiceController.getAllServices);
router.get("/category", service_controller_1.ServiceController.getByCategory);
router.get("/:id", service_controller_1.ServiceController.getSingleService);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), service_controller_1.ServiceController.updateSingleService);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), service_controller_1.ServiceController.deleteSingleService);
exports.ServiceRoutes = router;
