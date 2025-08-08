import mongoose from 'mongoose';
import crypto from 'crypto';
import { connectToDatabase } from '../../utils/database';
import { User } from '../models/User';
import { PendingEmailChange } from '../models/PendingEmailChange';
import { verifyToken, extractTokenFromHeader } from '../../utils/jwt';
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
        const { newEmail } = body;

        if (!newEmail) {
            await warn(`[REQUEST-EMAIL-CHANGE] Missing new email for user ID: ${payload.userId}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'New email address is required'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            await warn(`[REQUEST-EMAIL-CHANGE] Invalid email format for user ID: ${payload.userId}, email: ${newEmail}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid email format'
            });
        }

        const user = await User.findById(payload.userId);
        if (!user) {
            await warn(`[REQUEST-EMAIL-CHANGE] User not found: ID: ${payload.userId}.`);
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            });
        }

        if (user.email === newEmail) {
            throw createError({
                statusCode: 400,
                statusMessage: 'New email address must be different from current email'
            });
        }

        const existingUserWithEmail = await User.findOne({
            email: newEmail,
            _id: { $ne: new mongoose.Types.ObjectId(payload.userId) }
        });
        if (existingUserWithEmail) {
            await warn(`[REQUEST-EMAIL-CHANGE] Email already in use: ${newEmail} for user ID: ${payload.userId}.`);
            throw createError({
                statusCode: 409,
                statusMessage: 'Email address is already in use'
            });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        await PendingEmailChange.deleteMany({ userId: payload.userId });

        await PendingEmailChange.create({
            userId: payload.userId,
            currentEmail: user.email,
            newEmail,
            token: verificationToken
        });

        const verificationLink = `${process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        await sendEmail({
            to: newEmail,
            subject: 'Operation: NEXUS - Email Change Verification Required',
            html: generateEmailChangeVerificationHTML(user.agent.name, newEmail, verificationLink),
            text: `Hello ${user.agent.name},\n\nPlease verify your email change by clicking the following link: ${verificationLink}\n\nIf you did not request this change, please ignore this email.`
        });

        await success(`[REQUEST-EMAIL-CHANGE] Email change verification sent for user: ID: ${user._id}, new email: ${newEmail}.`);

        return {
            success: true,
            message: 'Verification email sent to new address'
        };

    } catch (err) {
        const error_obj = err as Error & { statusCode?: number };

        if (error_obj.statusCode) {
            throw error_obj;
        }

        console.error('Request email change error:', error_obj);
        await error(`[REQUEST-EMAIL-CHANGE] ${error_obj instanceof Error ? error_obj.message : 'Unknown error'}.`);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        });
    }
});