import { Router } from "express"
import UsersController from "@/controllers/users";
import { auth } from "@/middlewares/auth";

const router: Router = Router()

router.post("/me", UsersController.getUser)
router.post("/me/refresh", auth, UsersController.getUser)

export default router