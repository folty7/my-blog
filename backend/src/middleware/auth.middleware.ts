import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from 'jet-logger';
import EnvVars from '../common/constants/env';

// Extend the Express Request type to include the authenticated user's information
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Extract the token from the Authorization header (format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        // 2. Verify the JWT using centralized secret
        const decoded = jwt.verify(token, EnvVars.JwtSecret) as { userId: number; email: string };

        // 3. Attach decoded user data to the request for use in later handlers
        req.user = decoded;

        // 4. Move to the next middleware or route handler
        next();
    } catch (error) {
        logger.err(`JWT Verification Error: ${String(error)}`);
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
