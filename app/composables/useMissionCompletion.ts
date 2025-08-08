const isCompletionModalVisible = ref(false);
const completedMissionId = ref<string | null>(null);
const finalScore = ref(0);

export const useMissionCompletion = () => {
    const showCompletionModal = (missionId: string, score: number) => {
        completedMissionId.value = missionId;
        finalScore.value = score;
        isCompletionModalVisible.value = true;
    };

    const hideCompletionModal = () => {
        const justCompletedMission = completedMissionId.value;

        isCompletionModalVisible.value = false;
        completedMissionId.value = null;
        finalScore.value = 0;

        return justCompletedMission;
    };

    const getRankBasedOnScore = (score: number): { rank: string; color: string; description: string } => {
        if (score >= 90) {
            return {
                rank: 'LEGENDARY INVESTIGATOR',
                color: '#FFD700',
                description: 'Perfect investigation! You found every clue and solved the case flawlessly.'
            };
        } else if (score >= 75) {
            return {
                rank: 'MASTER DETECTIVE',
                color: '#C0C0C0',
                description: 'Outstanding work! You conducted a thorough investigation.'
            };
        } else if (score >= 60) {
            return {
                rank: 'SKILLED AGENT',
                color: '#CD7F32',
                description: 'Great job! You successfully solved the case with solid detective work.'
            };
        } else if (score >= 40) {
            return {
                rank: 'COMPETENT INVESTIGATOR',
                color: '#007acc',
                description: 'Well done! You gathered enough evidence to close the case.'
            };
        } else {
            return {
                rank: 'ROOKIE DETECTIVE',
                color: '#666',
                description: 'Case closed, but there\'s room for improvement in your investigation skills.'
            };
        }
    };

    const getMissionTitle = (missionId: string): string => {
        const gameStore = typeof useGameStore === 'function' ? useGameStore() : undefined;
        const mission = gameStore?.missions?.find((s: Mission) => s.id === missionId);

        if (mission && mission.title) return mission.title;

        return 'Unknown Case';
    };

    const completionData = computed(() => {
        if (!completedMissionId.value) return null;
        return {
            missionId: completedMissionId.value,
            missionTitle: getMissionTitle(completedMissionId.value),
            score: finalScore.value,
            rank: getRankBasedOnScore(finalScore.value)
        };
    });

    const restartCase = (missionId: string) => {
        if (missionId) {
            useGameStore().progress[missionId] = {
                emailsRead: [],
                chatsRead: [],
                filesExamined: [],
                evidenceFound: [],
                markedEvidence: [],
                suspectsIdentified: [],
                timelineBuilt: false,
                primarySuspectConfirmed: false,
                caseStatus: 'briefing',
                investigationScore: 0,
                hintsUsed: 0,
                emailUIStates: {},
                deletedEmails: [],
                activeEmailFolder: 'inbox',
                selectedEmail: null,
                emailSearchQuery: '',
                chatUIStates: {},
                deletedChats: [],
                permanentlyDeletedChats: [],
                activeChatId: null,
                chatFilter: 'chats',
                customChats: [],
                chatSearchQuery: ''
            };

            hideCompletionModal();
        }
    };

    return {
        isCompletionModalVisible: readonly(isCompletionModalVisible),
        completionData: readonly(completionData),
        showCompletionModal,
        hideCompletionModal,
        restartCase
    };
};