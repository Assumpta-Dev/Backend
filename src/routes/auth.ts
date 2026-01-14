import express from "express";
import { loginUser, registerUser, getUserProfile } from "../controller/auth";

const authenticationRouter = express.Router();
authenticationRouter.post("/register", registerUser);
authenticationRouter.post("/login", loginUser);
authenticationRouter.get("/profile", getUserProfile);


export default authenticationRouter;