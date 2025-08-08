import { defineStore } from 'pinia';

export const useNexusProcessingStore = defineStore('nexusProcessing', () => {
    const { restartCase, showCompletionModal } = useMissionCompletion();
    const gameStore = useGameStore();
    const authStore = useAuthStore();

    const showProcessingModal = ref(false);
    const currentStep = ref(0);
    const processingStatus = ref('INITIALIZING SYSTEM...');
    const processingText = ref('Connecting to NEXUS Database...');
    const dotIndex = ref(0);
    const processingError = ref(false);

    const processingSteps = [
        { status: 'ANALYZING EVIDENCE...', text: 'Cross-referencing digital fingerprints...' },
        { status: 'VERIFYING SUSPECTS...', text: 'Running background security checks...' },
        { status: 'ACCESSING DATABASE...', text: 'Connecting to central investigation records...' },
        { status: 'CALCULATING RESULTS...', text: 'Computing investigation score...' },
        { status: 'FINALIZING REPORT...', text: 'Generating investigation summary...' }
    ];

    const errorMessages = [
        'Network connection failed. Retrying...',
        'Database timeout. Attempting reconnection...',
        'Authentication error. Verifying credentials...',
        'Server overload. Waiting for response...',
        'Connection lost. Establishing new link...'
    ];

    let processingInterval: NodeJS.Timeout | null = null;
    let dotInterval: NodeJS.Timeout | null = null;

    const retryProcessing = () => {
        if (processingInterval) {
            clearInterval(processingInterval);
            processingInterval = null;
        }
        if (dotInterval) {
            clearInterval(dotInterval);
            dotInterval = null;
        }

        showProcessingModal.value = false;
        processingError.value = false;
        currentStep.value = 0;

        const currentMission = gameStore.currentMission;
        if (currentMission) {
            restartCase(currentMission);
        }
    };

    const cancelProcessing = () => {
        if (processingInterval) {
            clearInterval(processingInterval);
            processingInterval = null;
        }
        if (dotInterval) {
            clearInterval(dotInterval);
        }

        processingError.value = false;
        currentStep.value = 0;
        processingStatus.value = 'RETRYING CONNECTION...';
        processingText.value = 'Re-establishing NEXUS Database link...';
        dotIndex.value = 0;

        showProcessingModal.value = false;
    };

    const simulateRandomError = () => {
        return Math.random() < 0.2;
    };

    const confirmSuspect = async (selectedSuspects: string[]) => {
        if (!selectedSuspects.length || !gameStore.currentMission) return;

        showProcessingModal.value = true;
        currentStep.value = 0;
        processingStatus.value = 'INITIALIZING SYSTEM...';
        processingText.value = 'Connecting to NEXUS Database...';
        processingError.value = false;

        dotIndex.value = 0;
        dotInterval = setInterval(() => {
            dotIndex.value = (dotIndex.value + 1) % 3;
        }, 500);

        processingInterval = setInterval(() => {
            if (currentStep.value < processingSteps.length) {
                currentStep.value++;
                if (currentStep.value <= processingSteps.length) {
                    const step = processingSteps[currentStep.value - 1];
                    if (step) {
                        processingStatus.value = step.status;
                        processingText.value = step.text;
                    }
                }
            }
        }, 800);

        const missionContent = gameStore.currentMissionContent;
        const trueSuspects = missionContent?.characters?.filter((c: any) => c.isSuspect === true) || [];
        const trueSuspectIds = trueSuspects.map((s: any) => s.id);

        const correctSelection = selectedSuspects.length === trueSuspectIds.length &&
            selectedSuspects.every(id => trueSuspectIds.includes(id)) &&
            trueSuspectIds.every(id => selectedSuspects.includes(id));

        setTimeout(async () => {
            if (processingInterval) {
                clearInterval(processingInterval);
                processingInterval = null;
            }
            if (dotInterval) {
                clearInterval(dotInterval);
                dotInterval = null;
            }

            currentStep.value = processingSteps.length + 1;

            if (simulateRandomError()) {
                processingError.value = true;
                const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)] || 'Unknown system error occurred.';
                processingStatus.value = 'SYSTEM ERROR';
                processingText.value = randomErrorMessage;
                return;
            }

            const currentMission = gameStore.currentMission;
            if (!currentMission) {
                processingError.value = true;
                processingStatus.value = 'MISSION ERROR';
                processingText.value = 'No active mission found. Please restart the investigation.';
                return;
            }

            if (correctSelection) {
                selectedSuspects.forEach(suspectId => {
                    gameStore.markSuspectConfirmed(currentMission, suspectId);
                });

                try {
                    const result = await useScoring().updateScore(currentMission, 100);

                    if (authStore.user) {
                        const scoresMapRaw = authStore.user.gameProgress.missionScores;
                        let scoresMap: Map<string, number>;
                        if (scoresMapRaw instanceof Map) {
                            scoresMap = scoresMapRaw;
                        } else {
                            scoresMap = new Map(Object.entries(scoresMapRaw ?? {}));
                        }
                        const currentScore = scoresMap.get(currentMission) ?? 0;
                        let newScore = currentScore + 100;
                        if (newScore < 0) {
                            newScore = 0;
                        }
                        if (!scoresMap.has(currentMission) || currentScore <= 0) {
                            scoresMap.set(currentMission, newScore);
                            authStore.user.gameProgress.missionScores = scoresMap;
                        }
                    }

                    showProcessingModal.value = false;
                    showCompletionModal(currentMission, result.currentScore || 0);

                } catch (error) {
                    console.error('Error updating score:', error);
                    processingError.value = true;
                    processingStatus.value = 'DATABASE ERROR';
                    processingText.value = 'Failed to update investigation score. Please try again.';
                }
            } else {
                processingError.value = true;
                processingStatus.value = 'INVESTIGATION FAILED';
                processingText.value = 'Incorrect suspect identification. Evidence does not support this conclusion.';

                try {
                    restartCase(currentMission);
                    await useScoring().updateScore(currentMission, -10);
                } catch (error) {
                    console.error('Error updating score:', error);
                }
            }
        }, 4000);
    };

    const returnToMainMenu = () => {
        if (processingInterval) {
            clearInterval(processingInterval);
            processingInterval = null;
        }
        if (dotInterval) {
            clearInterval(dotInterval);
            dotInterval = null;
        }

        processingError.value = false;
        currentStep.value = 0;
        processingStatus.value = 'INITIALIZING SYSTEM...';
        processingText.value = 'Connecting to NEXUS Database...';
        dotIndex.value = 0;
        showProcessingModal.value = false;

        gameStore.exitLaptop();
    };

    const cleanup = () => {
        if (processingInterval) {
            clearInterval(processingInterval);
        }
        if (dotInterval) {
            clearInterval(dotInterval);
        }
    };

    return {
        showProcessingModal,
        currentStep,
        processingStatus,
        processingText,
        dotIndex,
        processingError,
        confirmSuspect,
        retryProcessing,
        cancelProcessing,
        returnToMainMenu,
        cleanup
    };
});