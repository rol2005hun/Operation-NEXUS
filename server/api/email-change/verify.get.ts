import { connectToDatabase } from '../../utils/database';
import { User } from '../models/User';
import { PendingEmailChange } from '../models/PendingEmailChange';
import { success, error, warn } from '../../utils/discord-logger';

export default defineEventHandler(async (event) => {
    if (event.method !== 'GET') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        await connectToDatabase();

        const query = getQuery(event);
        const { token } = query;

        if (!token || typeof token !== 'string') {
            await warn(`[VERIFY-EMAIL-CHANGE] Missing or invalid token.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Verification token is required'
            });
        }

        const pendingEmailChange = await PendingEmailChange.findOne({ token });

        if (!pendingEmailChange) {
            await warn(`[VERIFY-EMAIL-CHANGE] Invalid or expired token: ${token}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid or expired verification token'
            });
        }

        const user = await User.findById(pendingEmailChange.userId);
        if (!user) {
            await warn(`[VERIFY-EMAIL-CHANGE] User not found for token: ${token}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'User not found'
            });
        }

        const oldEmail = pendingEmailChange.currentEmail;
        const newEmail = pendingEmailChange.newEmail;

        await User.findByIdAndUpdate(pendingEmailChange.userId, {
            email: newEmail
        });

        await PendingEmailChange.findByIdAndDelete(pendingEmailChange._id);

        await success(`[VERIFY-EMAIL-CHANGE] Email successfully changed for user: ID: ${user._id}, from: ${oldEmail}, to: ${newEmail}.`);

        return {
            success: true,
            message: 'Email address successfully updated',
            newEmail
        };

    } catch (err) {
        const error_obj = err as Error & { statusCode?: number };

        if (error_obj.statusCode) {
            throw error_obj;
        }

        console.error('Verify email change error:', error_obj);
        await error(`[VERIFY-EMAIL-CHANGE] ${error_obj instanceof Error ? error_obj.message : 'Unknown error'}.`);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        });
    }
});