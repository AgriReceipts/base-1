import { Router } from "express";
import {
  deleteTarget,
  getTargets,
  setTarget,
} from "../controllers/targets/targetController";
import { authenticateUser } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roleAccess";

const targetRoutes = Router();
targetRoutes.use(authenticateUser);
targetRoutes.use(authorizeRoles("ad", "secretary"));
targetRoutes.post("/setTarget", setTarget);
targetRoutes.get("/getTargets", getTargets);
targetRoutes.delete("/deleteTarget/:id", deleteTarget);

export default targetRoutes;
