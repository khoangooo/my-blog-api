import { Router } from "express"
import { getPosts, getPost, addPost, updatePost, deletePost } from "../../controllers/posts"

const router: Router = Router()

router
  .get("/posts", getPosts)
  .get("/post/:id", getPost)
  .post("/post", addPost)
  .put("/post/:id", updatePost)
  .delete("/post/:id", deletePost)

export default router