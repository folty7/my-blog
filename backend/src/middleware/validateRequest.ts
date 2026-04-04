import { Request, Response, NextFunction } from 'express';

// We define a simple type for the rules we want to check
type ValidationRule = {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'array';
    required?: boolean;
    minLength?: number;
};

// This is a "factory function". It returns an Express middleware.
export const validateBody = (rules: ValidationRule[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors: string[] = [];

        for (const rule of rules) {
            const value = (req.body as Record<string, unknown>)[rule.field];

            // 1. Check if a required field is missing
            if (rule.required && (value === undefined || value === null)) {
                errors.push(`Field '${rule.field}' is required and missing.`);
                continue;
            }

            // If it's not required and it is missing, we can skip the rest of the checks
            if (!rule.required && (value === undefined || value === null)) {
                continue;
            }

            // 2. Check the datatype
            if (rule.type === 'array') {
                if (!Array.isArray(value)) {
                    errors.push(`Field '${rule.field}' must be an array.`);
                    continue;
                }
            } else if (typeof value !== rule.type) {
                errors.push(`Field '${rule.field}' must be a ${rule.type}, received ${typeof value}.`);
                continue; // Skip further checks for this field to avoid runtime errors
            }

            // 3. String-specific rules (e.g., length)
            if (rule.type === 'string' && typeof value === 'string') {
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`Field '${rule.field}' must be at least ${rule.minLength} characters long.`);
                }
            }
        }

        // If we found any errors, stop the request and return a 400 Bad Request
        if (errors.length > 0) {
            // Notice how we must RETURN res.status() to stop the execution here!
            res.status(400).json({ errors });
            return;
        }

        // If everything is valid, proceed to the actual route handler!
        next();
    };
};
