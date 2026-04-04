import { Router, Response } from 'express';
import logger from 'jet-logger';
import { prisma } from '../db/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validateRequest';

interface CommentRequestBody {
  content: string;
  postId: number;
}

const router = Router();

// 1. ADD A COMMENT (Protected)
router.post('/', 
    authenticateToken,
    validateBody([
        { field: 'content', type: 'string', required: true },
        { field: 'postId', type: 'number', required: true }
    ]),
    async (req: AuthRequest, res: Response) => {
        try {
            const { content, postId } = req.body as CommentRequestBody;
            const authorId = req.user?.userId;

            const comment = await prisma.comment.create({
                data: {
                    content,
                    postId,
                    authorId: authorId!
                },
                include: { 
                  author: { 
                    select: { name: true } 
                  } 
                } 
            });

            res.status(201).json(comment);
        } catch (error) {
            logger.err(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// 2. GET COMMENTS FOR A POST (Public)
router.get('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(String(postId)) },
            include: { 
              author: { 
                select: { name: true } 
              } 
            },
            orderBy: { createdAt: 'asc' }
        });
        res.json(comments);
    } catch (error) {
        logger.err(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. DELETE A COMMENT (Protected)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Find comment first to check ownership
      const comment = await prisma.comment.findUnique({
          where: { id: parseInt(String(id)) }
      });

      if (!comment) {
          res.status(404).json({ error: 'Comment not found' });
          return;
      }

      // Medior security check: Only the author can delete their own comment
      if (comment.authorId !== userId) {
          res.status(403).json({ error: 'You are only allowed to delete your own comments' });
          return;
      }

      await prisma.comment.delete({
          where: { id: parseInt(String(id)) }
      });

      res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
      logger.err(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
