import { Router } from "express"
import { getUser } from "../../controllers/users"

const router: Router = Router()

router.post("/me", getUser)

export default router