import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from 'jet-logger';
import { prisma } from '../db/prisma';
import { validateBody } from '../middleware/validateRequest';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import EnvVars from '../common/constants/env';

interface AuthRequestBody {
    email: string;
    password: string;
    name?: string;
}

const router = Router();

// 1. REGISTER ROUTE
router.post('/register',
    validateBody([
        { field: 'email', type: 'string', required: true },
        { field: 'password', type: 'string', required: true, minLength: 6 },
        { field: 'name', type: 'string', required: false }
    ]),
    async (req: Request, res: Response) => {
        try {
            const { email, password, name } = req.body as AuthRequestBody;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(400).json({ error: 'User with this email already exists' });
                return;
            }

            // Hash the password securely
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save to database
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                }
            });

            // Generate JWT for auto-login
            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                EnvVars.JwtSecret,
                { expiresIn: '1d' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name
                }
            });
        } catch (error) {
            logger.err(`Registration Error: ${String(error)}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// 2. LOGIN ROUTE
router.post('/login',
    validateBody([
        { field: 'email', type: 'string', required: true },
        { field: 'password', type: 'string', required: true }
    ]),
    async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body as AuthRequestBody;

            // Find user in DB
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            // Check passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            // Generate JWT payload with non-sensitive user info
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                EnvVars.JwtSecret,
                { expiresIn: '1d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            logger.err(`Login Error: ${String(error)}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// 3. SECURE PROFILE "ME" ROUTE
// This route proves that our authenticateToken middleware is working correctly.
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        // req.user was attached to the request in the authenticateToken middleware
        const userId = req.user?.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, createdAt: true } // Exclude password hash!
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error) {
        logger.err(`Me Route Error: ${String(error)}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
