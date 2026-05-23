import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);

export const userRoute = router;
