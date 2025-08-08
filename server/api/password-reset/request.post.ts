import crypto from 'crypto';
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
        const { email } = body;

        if (!email) {
            await warn(`[FORGOT PASSWORD] Attempt with missing email.`);
            return {
                success: false,
                message: 'Email address is required'
            };
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            await warn(`[FORGOT PASSWORD] Request for non-existent email: ${email}`);
            return {
                success: true,
                message: 'If an account with this email exists, you will receive a password reset link shortly.'
            };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        await PendingPasswordReset.deleteMany({ userId: user._id });

        await PendingPasswordReset.create({
            userId: user._id,
            email: user.email,
            token: resetToken
        });

        const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: email,
            subject: 'Operation: NEXUS - Password Reset Request',
            html: generatePasswordResetEmailHTML(user.agent.name, resetLink),
            text: `Password reset requested for your account. Click this link to reset your password: ${resetLink}. If you did not request this, please ignore this email.`
        });

        await success(`[FORGOT PASSWORD] Password reset email sent to: ${email} (User: ${user.agent.name})`);

        return {
            success: true,
            message: 'If an account with this email exists, you will receive a password reset link shortly.'
        };

    } catch (err: any) {
        await error(`[FORGOT PASSWORD] Error: ${err.message}`);

        return {
            success: false,
            message: 'An error occurred while processing your request. Please try again later.'
        };
    }
});