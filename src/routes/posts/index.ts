import { Router } from "express"
import { getPosts, getPost, addPost, updatePost, deletePost } from "../../controllers/posts"

const router: Router = Router()

router.get("/posts", getPosts)

router.get("/post/:id", getPost)

router.post("/post", addPost)

router.put("/post/:id", updatePost)

router.delete("/post/:id", deletePost)

export default router