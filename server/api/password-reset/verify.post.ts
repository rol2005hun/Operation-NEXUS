import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../utils/database';
import { User } from '../models/User';
import { PendingPasswordReset } from '../models/PendingPasswordReset';
import { success, error, warn } from '../../utils/discord-logger';

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        });
    }

    try {
        await connectToDatabase();

        const body = await readBody(event);
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            await warn(`[RESET PASSWORD] Attempt with missing token or password.`);
            return {
                success: false,
                message: 'Reset token and new password are required'
            };
        }

        if (newPassword.length < 6) {
            return {
                success: false,
                message: 'Password must be at least 6 characters long'
            };
        }

        const pendingPasswordReset = await PendingPasswordReset.findOne({ token });

        if (!pendingPasswordReset) {
            await warn(`[RESET PASSWORD] Invalid or expired token: ${token}`);
            return {
                success: false,
                message: 'Invalid or expired reset token. Please request a new password reset.'
            };
        }

        const user = await User.findById(pendingPasswordReset.userId);
        if (!user) {
            await warn(`[RESET PASSWORD] User not found for token: ${token}`);
            return {
                success: false,
                message: 'User not found.'
            };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        await user.save();

        await PendingPasswordReset.findByIdAndDelete(pendingPasswordReset._id);

        await success(`[RESET PASSWORD] Password successfully reset for user: ${user.agent.name} (${user.email})`);

        return {
            success: true,
            message: 'Your password has been successfully reset. You can now log in with your new password.'
        };

    } catch (err: any) {
        await error(`[RESET PASSWORD] Error: ${err.message}`);

        return {
            success: false,
            message: 'An error occurred while resetting your password. Please try again later.'
        };
    }
});