import { Router, Response } from 'express';
import logger from 'jet-logger';
import { prisma } from '../db/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validateRequest';

interface PostRequestBody {
  title: string;
  content: string;
  slug: string;
  tags?: string[];
}

const router = Router();

// 0. GET MY POSTS (Protected)
router.get('/my-posts', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const authorId = req.user?.userId;
    const posts = await prisma.post.findMany({
      where: { authorId },
      include: { tags: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    logger.err(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 1.5. GET POST BY ID (Public)
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(String(id)) },
      include: {
        author: { select: { name: true, email: true } },
        tags: true
      }
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    logger.err(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 1. GET ALL POSTS (Public)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        tags: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    logger.err(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. CREATE A POST (Protected)
router.post('/',
  authenticateToken, // Only logged-in users
  validateBody([
    { field: 'title', type: 'string', required: true },
    { field: 'content', type: 'string', required: true },
    { field: 'slug', type: 'string', required: true },
    { field: 'tags', type: 'array', required: false }
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, content, slug, tags } = req.body as PostRequestBody;
      const authorId = req.user?.userId; // Get ID from the JWT token!

      const post = await prisma.post.create({
        data: {
          title,
          content,
          slug,
          authorId: authorId!,
          published: true, // Automatically publish for now
          // Automatically link existing tags or create new ones
          tags: {
            connectOrCreate: tags?.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            }))
          }
        },
        include: { tags: true }
      });

      res.status(201).json(post);
    } catch (error) {
      logger.err(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 3. GET A SINGLE POST BY SLUG (Public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug: String(slug) },
      include: {
        author: { select: { name: true, email: true } },
        tags: true
      }
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    logger.err(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. UPDATE A POST (Protected)
router.patch('/:id',
  authenticateToken,
  validateBody([
    { field: 'title', type: 'string', required: false },
    { field: 'content', type: 'string', required: false },
    { field: 'slug', type: 'string', required: false },
    { field: 'tags', type: 'array', required: false }
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content, slug, tags } = req.body as PostRequestBody;

      const updatedPost = await prisma.post.update({
        where: { id: parseInt(String(id)) },
        data: {
          title,
          content,
          slug,
          tags: tags ? {
            set: [], // Clear existing tags first (in case user wants to remove some tags)
            connectOrCreate: tags.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            }))
          } : undefined
        },
        include: { tags: true }
      });

      res.json(updatedPost);
    } catch (error) {
      logger.err(error);
      res.status(500).json({ error: 'Internal server error or Post not found' });
    }
  }
);

// 5. DELETE A POST (Protected)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: parseInt(String(id)) }
    });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.err(error);
    res.status(500).json({ error: 'Internal server error or Post not found' });
  }
});

export default router;
