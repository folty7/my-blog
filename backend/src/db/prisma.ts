import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import EnvVars, { NodeEnvs } from '../common/constants/env';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
    const pool = new Pool({ connectionString: EnvVars.DatabaseUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
    });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (EnvVars.NodeEnv !== NodeEnvs.PRODUCTION) globalForPrisma.prisma = prisma;
