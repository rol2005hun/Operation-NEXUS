import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@@/server/utils/database';
import { User } from '@@/server/api/models/User';
import { verifyToken, extractTokenFromHeader } from '@@/server/utils/jwt';
import { success, error, warn } from '@@/server/utils/discord-logger';

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        await connectToDatabase();

        const authHeader = getHeader(event, 'authorization');
        let token = extractTokenFromHeader(authHeader);

        if (!token) {
            token = getCookie(event, 'auth-token') || null;
        }

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

        const body = await readBody(event);
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            await warn(`[CHANGE-PASSWORD] Attempt with missing fields for user ID: ${payload.userId}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            await warn(`[CHANGE-PASSWORD] Attempt with weak password for user ID: ${payload.userId}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'New password must be at least 6 characters long'
            });
        }

        const user = await User.findById(payload.userId);
        if (!user) {
            await warn(`[CHANGE-PASSWORD] User not found: ID: ${payload.userId}.`);
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            await warn(`[CHANGE-PASSWORD] Incorrect current password for user: ID: ${user._id}, username: ${user.username}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Current password is incorrect'
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        await User.findByIdAndUpdate(
            payload.userId,
            { password: hashedNewPassword },
            { runValidators: true }
        );

        await success(`[CHANGE-PASSWORD] Password changed successfully for user: ID: ${user._id}, username: ${user.username}.`);

        return {
            success: true,
            message: 'Password changed successfully'
        };

    } catch (err) {
        const error_obj = err as Error & { statusCode?: number };
        
        if (error_obj.statusCode) {
            throw error_obj;
        }

        console.error('Password change error:', error_obj);
        await error(`[CHANGE-PASSWORD] ${error_obj instanceof Error ? error_obj.message : 'Unknown error'}.`);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        });
    }
});