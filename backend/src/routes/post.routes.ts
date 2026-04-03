import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller';
// import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

// router.use(requireAuth); // Protect all routes below
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
