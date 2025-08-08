import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectToDatabase } from '../../utils/database';
import { User } from '../models/User';
import { PendingUser } from '../models/PendingUser';
import { success, error, warn, info } from '../../utils/discord-logger';

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
        const { username, email, password, agentName } = body;

        if (!username || !email || !password || !agentName) {
            await warn(`[REGISTER] Attempt with missing fields: ${JSON.stringify({ username: !!username, email: !!email, password: !!password, agentName: !!agentName })}`);
            return {
                success: false,
                message: 'Missing required fields'
            };
        }

        if (password.length < 6) {
            await warn(`[REGISTER] Attempt with weak password for user: ${username}`);
            return {
                success: false,
                message: 'Password must be at least 6 characters'
            };
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            await warn(`[REGISTER] Attempt with existing credentials: ${existingUser.email === email ? 'email' : 'username'} already exists for ${username || email}`);
            return {
                success: false,
                message: 'User with this email or username already exists'
            };
        }

        const existingPendingUser = await PendingUser.findOne({
            $or: [{ email }, { username }]
        });

        if (existingPendingUser) {
            await PendingUser.deleteOne({ _id: existingPendingUser._id });
            await info(`[REGISTER] Removed existing pending registration for: ${username || email}`);
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const pendingUser = new PendingUser({
            username,
            email,
            password: hashedPassword,
            agentName,
            verificationToken
        });

        await pendingUser.save();

        const verificationLink = `${process.env.BASE_URL || 'http://localhost:3000'}/verify-account?token=${verificationToken}`;

        const emailHTML = generateAccountVerificationEmailHTML(agentName, verificationLink);

        const isDevelopment = process.env.NODE_ENV === 'development';
        const hasEmailConfig = process.env.SMTP_USER && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN;

        if (isDevelopment && !hasEmailConfig) {
            await info(`[REGISTER] Development mode: Auto-verifying user ${username} (${email})`);

            return {
                success: true,
                message: 'Development mode: Registration completed! (Email verification skipped)',
                email: email,
                verificationLink: verificationLink
            };
        }

        try {
            await sendEmail({
                to: email,
                subject: 'Operation: NEXUS - Agent Account Verification Required',
                text: `Welcome to NEXUS, Agent ${agentName}! Please verify your email by visiting: ${verificationLink}. If you did not request this, please ignore this email.`,
                html: emailHTML,
            });

            await success(`[REGISTER] Verification email sent to: ${email} for username: ${username}, agent: ${agentName}`);

            return {
                success: true,
                message: 'Registration initiated! Please check your email and click the verification link to complete your account setup.',
                email: email
            };
        } catch (emailError) {
            await warn(`[REGISTER] Email sending failed for ${email}: ${emailError}`);

            if (isDevelopment) {
                return {
                    success: true,
                    message: 'Development mode: Email sending failed, but you can use this verification link:',
                    email: email,
                    verificationLink: verificationLink
                };
            } else {
                return {
                    success: false,
                    message: 'Registration failed: Unable to send verification email. Please try again later or contact support.'
                };
            }
        }

    } catch (err) {
        const error_obj = err as Error & { statusCode?: number };

        if (error_obj.statusCode === 409) {
            await warn(`[REGISTER] Duplicate user attempt: ${error_obj.message || 'User already exists'}`);
            return {
                success: false,
                message: error_obj.message || 'User with this email or username already exists'
            };
        }

        if (error_obj.statusCode === 400) {
            await warn(`[REGISTER] Invalid input: ${error_obj.message || 'Invalid data provided'}`);
            return {
                success: false,
                message: error_obj.message || 'Invalid registration data'
            };
        }

        console.error('Registration error:', err);
        await error(`[REGISTER] ${error_obj instanceof Error ? error_obj.message : 'Unknown error'}.`);

        return {
            success: false,
            message: 'Internal server error during registration. Please try again later.'
        };
    }
});