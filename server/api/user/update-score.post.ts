import { connectToDatabase } from '@@/server/utils/database';
import { User } from '@@/server/api/models/User';
import { verifyToken, extractTokenFromHeader } from '@@/server/utils/jwt';
import { success, error, warn, info } from '@@/server/utils/discord-logger';

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed.'
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
                statusMessage: 'Authorization token required.'
            });
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid or expired token.'
            });
        }

        const body = await readBody(event);
        const { missionId, points } = body;

        if (!missionId) {
            await warn(`[UPDATE-SCORE] Missing mission ID for user ID: ${payload.userId}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Mission ID is required.'
            });
        }

        if (typeof points !== 'number' || ![100, -10].includes(points)) {
            await warn(`[UPDATE-SCORE] Invalid points value: ${points} for user ID: ${payload.userId}, mission: ${missionId}.`);
            throw createError({
                statusCode: 400,
                statusMessage: 'Points must be either 100 or -10.'
            });
        }

        const user = await User.findById(payload.userId);
        if (!user) {
            await warn(`[UPDATE-SCORE] User not found: ID: ${payload.userId}.`);
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found.'
            });
        }

        if (!user.gameProgress) {
            user.gameProgress = {
                purchasedMissions: [],
                currentMission: null,
                totalPlaytime: 0,
                missionScores: new Map(),
                achievements: []
            };
        }
        if (!user.gameProgress.missionScores) {
            user.gameProgress.missionScores = new Map();
        }

        let currentMissionScore = user.gameProgress.missionScores.get(missionId);
        let message = '';

        if (typeof currentMissionScore === 'number' && currentMissionScore >= 0) {
            message = `Mission already completed or score is non-negative. No modification allowed. Current score: ${currentMissionScore}`;
            await info(`[UPDATE-SCORE] Attempt to modify completed mission score for user: ID: ${user._id}, username: ${user.username}, mission: ${missionId}, score: ${currentMissionScore}. Modification denied.`);

            return {
                success: true,
                currentScore: currentMissionScore,
                message: message
            };
        }

        if (points === -10) {
            let newScore = (typeof currentMissionScore === 'number' ? currentMissionScore : 0) + points;

            user.gameProgress.missionScores.set(missionId, newScore);

            message = `Wrong guess. Score decreased by 10. New score: ${user.gameProgress.missionScores.get(missionId)}`;
            await info(`[UPDATE-SCORE] Score decreased for user: ID: ${user._id}, username: ${user.username}, mission: ${missionId}, new score: ${user.gameProgress.missionScores.get(missionId)}.`);
        } else if (points === 100) {
            let newScore = (typeof currentMissionScore === 'number' ? currentMissionScore : 0) + points;

            if (newScore < 0) {
                newScore = 0;
            }

            user.gameProgress.missionScores.set(missionId, newScore);

            message = `Mission completed. Points added: 100. New score: ${user.gameProgress.missionScores.get(missionId)}`;
            await success(`[UPDATE-SCORE] Mission completed by user: ID: ${user._id}, username: ${user.username}, mission: ${missionId}, new score: ${user.gameProgress.missionScores.get(missionId)}.`);
        } else {
            await warn(`[UPDATE-SCORE] Invalid points value: ${points} for user ID: ${payload.userId}, mission: ${missionId}.`);

            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid points value. Must be either 100 or -10.'
            });
        }

        await user.save();

        const updatedUser = await User.findById(payload.userId);

        if (!updatedUser) {
            await error(`[UPDATE-SCORE] Failed to update user progress for user ID: ${payload.userId}, mission: ${missionId}.`);

            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update user progress.'
            });
        }

        return {
            success: true,
            currentScore: updatedUser.gameProgress.missionScores.get(missionId) || 0,
            message: message
        };

    } catch (err) {
        const error_obj = err as Error & { statusCode?: number };
        
        if (error_obj.statusCode) {
            throw error_obj;
        }

        console.error('Mission score update error: ', error_obj);
        await error(`[UPDATE-SCORE] ${error_obj instanceof Error ? error_obj.message : 'Unknown error'}.`);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error.'
        });
    }
});