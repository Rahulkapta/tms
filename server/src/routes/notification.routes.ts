import express from "express";


import { verifyJWT } from "../config/middleware/auth.middleware";
import { getNotifications } from "../controllers/notification.controller";

const notificationRoutes = express.Router();


notificationRoutes.route("/").get(verifyJWT, getNotifications);

export default notificationRoutes;
