import { Router } from "express"
import UsersController from "@/controllers/users";
import { auth } from "@/middlewares/auth";

const router: Router = Router()

router
  .post("/login", UsersController.login)
  .get("/me", auth, UsersController.getUser)
  .get("/refresh", auth, UsersController.refresh)
  .post("/register", UsersController.register)
  .get("/logout", auth, UsersController.logout)

export default router