import { Router } from "express"
import UsersController from "@/controllers/users";
import { auth } from "@/middlewares/auth";

const router: Router = Router()

router
  .post("/login", UsersController.login)
  .get("/me", auth, UsersController.getUser)
  .post("/refresh", auth, UsersController.refresh)

export default router