import { Response, Request } from "express"
import { IPost } from "../types/posts"
import Post from "../models/post"
import { getErrorMessage } from "@/utils"

const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts: IPost[] = await Post.find()
    res.status(200).json({ status: true, data: posts })
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { params: { id } } = req
    const post: IPost | null = await Post.findById(id)
    res.status(200).json({ status: true, data: post })
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const addPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IPost, "title" | "excerpt" | "content">

    const post: IPost = new Post({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
    })

    const newPost: IPost = await post.save()
    const allPosts: IPost[] = await Post.find()

    res
      .status(201)
      .json({ message: "Post added" })
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req
    const updatePost: IPost | null = await Post.findByIdAndUpdate(
      { _id: id },
      body
    )
    const allPosts: IPost[] = await Post.find()
    res.status(200).json({
      message: "Post updated",
      post: updatePost,
    })
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPost: IPost | null = await Post.findByIdAndRemove(
      req.params.id
    )
    const allPosts: IPost[] = await Post.find()
    res.status(200).json({
      message: "Post deleted",
      post: deletedPost,
    })
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
}

const PostsController = { getPosts, getPost, addPost, updatePost, deletePost }

export default PostsController;