import { Router } from 'express';
import logger from 'jet-logger';
import { prisma } from '../db/prisma';

const router = Router();

// 1. GET ALL TAGS (Public)
// Returns all tags and counts how many posts are associated with each
router.get('/', async (req, res) => {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: 'asc' },
            include: {
              _count: {
                select: { posts: true }
              }
            }
        });
        res.json(tags);
    } catch (error) {
        logger.err(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. GET POSTS BY TAG NAME (Public)
// Fetches posts that are tagged with the given tag name
router.get('/:name/posts', async (req, res) => {
    try {
        const { name } = req.params;
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                tags: {
                    some: {
                        name: String(name)
                    }
                }
            },
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

export default router;
