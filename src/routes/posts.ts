import { Router } from "express"
import PostsController from "@/controllers/posts"
import { auth } from "@/middlewares/auth"

const router: Router = Router()

router
  .get("/posts", auth, PostsController.getPosts)
  .get("/post/:id", auth, PostsController.getPost)
  .post("/post", auth, PostsController.addPost)
  .put("/post/:id", auth, PostsController.updatePost)
  .delete("/post/:id", auth, PostsController.deletePost)

export default router;