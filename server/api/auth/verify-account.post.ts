import { connectToDatabase } from '../../utils/database';
import { PendingUser } from '../models/PendingUser';
import { User } from '../models/User';
import { generateToken } from '../../utils/jwt';
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
        const { token } = body;

        if (!token || typeof token !== 'string') {
            await warn(`[EMAIL-VERIFY] Attempt with missing or invalid token`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid verification token'
            });
        }

        const pendingUser = await PendingUser.findOne({ verificationToken: token });

        if (!pendingUser) {
            await warn(`[EMAIL-VERIFY] Attempt with non-existent token: ${token}`);
            throw createError({
                statusCode: 404,
                statusMessage: 'Invalid or expired verification token'
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email: pendingUser.email }, { username: pendingUser.username }]
        });

        if (existingUser) {
            await PendingUser.deleteOne({ _id: pendingUser._id });
            await warn(`[EMAIL-VERIFY] User already exists during verification: ${pendingUser.email}`);
            throw createError({
                statusCode: 409,
                statusMessage: 'User with this email or username already exists'
            });
        }

        const newUser = new User({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password,
            agent: {
                name: pendingUser.agentName,
            }
        });

        const savedUser = await newUser.save();

        await PendingUser.deleteOne({ _id: pendingUser._id });

        await success(`[EMAIL-VERIFY] Email verified and user created: ID: ${savedUser._id}, username: ${pendingUser.username}, email: ${pendingUser.email}, agent: ${pendingUser.agentName}`);

        const authToken = generateToken({
            userId: savedUser._id.toString(),
            email: savedUser.email,
            username: savedUser.username
        });

        const userResponse = {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            agent: savedUser.agent,
            gameProgress: savedUser.gameProgress,
            subscription: savedUser.subscription,
            createdAt: savedUser.createdAt
        };

        await success(`[EMAIL-VERIFY] User ${pendingUser.username} successfully verified and logged in.`);

        return {
            success: true,
            message: 'Account verified successfully',
            user: userResponse,
            token: authToken
        };
    } catch (err) {
        console.error('Email verification error:', err);

        const error_obj = err as Error & { statusCode?: number };

        if (!error_obj.statusCode) {
            await error(`[EMAIL-VERIFY] ${error_obj instanceof Error ? error_obj.message : 'Unknown error'}`);
        }

        if (error_obj.statusCode) {
            throw error_obj;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error during email verification'
        });
    }
});