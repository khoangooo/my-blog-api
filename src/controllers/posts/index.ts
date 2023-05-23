import { Response, Request } from "express"
import { IPost } from "../../types/posts"
import Post from "../../models/post"

const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts: IPost[] = await Post.find()
    res.status(200).json({ posts })
  } catch (error) {
    throw error
  }
}

const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { params: { id } } = req
    const post: IPost | null = await Post.findById(id)
    res.status(200).json({ post })
  } catch (error) {
    throw error
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
      .json({ message: "Post added", post: newPost, posts: allPosts })
  } catch (error) {
    throw error
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
      posts: allPosts,
    })
  } catch (error) {
    throw error
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
      posts: allPosts,
    })
  } catch (error) {
    throw error
  }
}

export { getPosts, getPost, addPost, updatePost, deletePost }