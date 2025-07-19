import { Router } from "express";
import { authorizeRoles } from "../middleware/roleAccess";
import { authenticateUser } from "../middleware/auth";
import {
  deleteUser,
  getAllUsers,
  login,
  registerUser,
} from "../controllers/auth/authController";
import { w } from "@faker-js/faker/dist/airline-CLphikKp";

const authRoutes = Router();

authRoutes.post(
  "/register",
  authenticateUser,
  authorizeRoles("ad"),
  registerUser,
);
authRoutes.post("/login", login);
authRoutes.get("/users", authenticateUser, authorizeRoles("ad"), getAllUsers);
//authRoutes.post('/deactivate/:id',deactivate)
authRoutes.delete("/delete/:id", authenticateUser, deleteUser);

export default authRoutes;
