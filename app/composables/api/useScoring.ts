export const useScoring = () => {
    const updateScore = async (missionId: string, points: number): Promise<ScoreUpdateResponse> => {
        try {
            const response = await $fetch<ScoreUpdateResponse>('/api/user/update-score', {
                method: 'POST',
                body: {
                    missionId,
                    points
                }
            });

            return response;
        } catch (error) {
            console.error('Failed to update score:', error);
            throw new Error('Score update failed');
        }
    };

    return {
        updateScore
    };
};