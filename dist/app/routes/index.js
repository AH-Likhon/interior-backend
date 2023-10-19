"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const service_route_1 = require("../modules/service/service.route");
const booking_route_1 = require("../modules/booking/booking.route");
const reviewRating_route_1 = require("../modules/reviewAndRating/reviewRating.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/service",
        route: service_route_1.ServiceRoutes,
    },
    {
        path: "/booking",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/reviews",
        route: reviewRating_route_1.ReviewAndRatingRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
