import { connectToDatabase } from '@@/server/utils/database';
import { User } from '@@/server/api/models/User';
import { verifyToken, extractTokenFromHeader } from '@@/server/utils/jwt';

export default defineEventHandler(async (event) => {
    if (event.method !== 'GET') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        await connectToDatabase();

        const authHeader = getHeader(event, 'authorization');
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Authorization token required'
            });
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid or expired token'
            });
        }

        const user = await User.findById(payload.userId);

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            });
        }

        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            agent: user.agent,
            gameProgress: user.gameProgress,
            subscription: user.subscription,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return {
            success: true,
            user: userResponse
        };

    } catch (error) {
        console.error('Profile fetch error:', error);

        const error_obj = error as Error & { statusCode?: number };

        if (error_obj.statusCode) {
            throw error_obj;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        });
    }
});