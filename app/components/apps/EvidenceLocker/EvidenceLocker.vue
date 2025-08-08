<template>
    <div class="app-evidence-locker">
        <CompleteInvestigationButton v-if="canIdentifySuspects" @click="openSuspectSelection" />

        <EvidenceLockerHeader :mission-data="gameStore.currentMissionData" :status-class="statusClass"
            :status-text="statusText" />

        <TabsContainer v-if="usePremium().canAccessPremiumFeatures.value" :active-tab="activeTab"
            @update:activeTab="activeTab = $event" />

        <div class="evidence-content">
            <EvidenceTab v-if="activeTab === 'evidence'" :investigation-progress="investigationProgress"
                :progress-class="progressClass" :progress-status-text="progressStatusText"
                :evidence-items="evidenceItems" @remove-evidence="removeEvidence" />

            <TimelineTab v-if="activeTab === 'timeline'" :revealed-timeline-events="revealedTimelineEvents" />
        </div>

        <SuspectSelectionModal v-if="showSuspectModal" :available-suspects="availableSuspects"
            :selected-suspects="selectedSuspects" @close="closeSuspectModal" @select-suspect="selectSuspect"
            @confirm="confirmSuspect" />
    </div>
</template>

<script setup lang="ts">
import CompleteInvestigationButton from './CompleteInvestigationButton.vue';
import EvidenceLockerHeader from './EvidenceLockerHeader.vue';
import TabsContainer from './TabsContainer.vue';
import EvidenceTab from './EvidenceTab.vue';
import TimelineTab from './TimelineTab.vue';
import SuspectSelectionModal from './SuspectSelectionModal.vue';

const gameStore = useGameStore();
const authStore = useAuthStore();
const nexusProcessingStore = useNexusProcessingStore();

const activeTab = ref('evidence');

const investigationProgress = computed(() => {
    const progress = gameStore.currentProgress;
    const missionContent = gameStore.currentMissionContent;

    if (!progress || !missionContent) return 0;

    const realEvidenceIds = missionContent.evidenceItems || [];
    const markedEvidence = progress.markedEvidence || [];

    if (realEvidenceIds.length === 0) return 0;

    const foundRealEvidence = markedEvidence.filter(id => realEvidenceIds.includes(id));
    const foundFakeEvidence = markedEvidence.filter(id => !realEvidenceIds.includes(id));
    const effectiveEvidenceCount = foundRealEvidence.length - foundFakeEvidence.length;

    const totalRealEvidence = realEvidenceIds.length;
    const tolerance = Math.max(1, Math.ceil(totalRealEvidence * 0.3));
    const minRequired = totalRealEvidence - tolerance;

    if (effectiveEvidenceCount >= minRequired) {
        return 100;
    } else {
        const progressPercent = Math.max(0, Math.floor((effectiveEvidenceCount / minRequired) * 100));
        return Math.min(progressPercent, 99);
    }
});

const progressClass = computed(() => {
    const progress = investigationProgress.value;

    if (progress >= 80) return 'progress-high';
    if (progress >= 40) return 'progress-medium';

    return 'progress-low';
});

const progressStatusText = computed(() => {
    const progress = investigationProgress.value;
    const gameProgress = gameStore.currentProgress;
    const missionContent = gameStore.currentMissionContent;

    if (!gameProgress || !missionContent) return 'Investigation Starting';

    const canIdentify = canIdentifySuspects.value;

    if (canIdentify) return 'Ready to Identify Suspects';
    if (progress >= 80) return 'Investigation Nearly Complete';
    if (progress >= 60) return 'Significant Progress Made';
    if (progress >= 40) return 'Investigation Ongoing';
    if (progress >= 20) return 'Initial Evidence Collected';

    return 'Investigation Starting';
});

const canIdentifySuspects = computed(() => {
    const progress = gameStore.currentProgress;
    const missionContent = gameStore.currentMissionContent;

    if (!progress || !missionContent) return false;
    if (progress.caseStatus === 'completed') return false;

    const realEvidenceIds = missionContent.evidenceItems || [];
    const markedEvidence = progress.markedEvidence || [];

    if (realEvidenceIds.length === 0) return false;

    const foundRealEvidence = markedEvidence.filter(id => realEvidenceIds.includes(id));
    const foundFakeEvidence = markedEvidence.filter(id => !realEvidenceIds.includes(id));
    const effectiveEvidenceCount = foundRealEvidence.length - foundFakeEvidence.length;

    const totalRealEvidence = realEvidenceIds.length;
    const tolerance = Math.max(1, Math.ceil(totalRealEvidence * 0.3));
    const minRequired = totalRealEvidence - tolerance;
    const maxAllowed = totalRealEvidence + tolerance;

    return effectiveEvidenceCount >= minRequired && effectiveEvidenceCount <= maxAllowed;
});

const showSuspectModal = ref(false);
const selectedSuspects = ref<string[]>([]);

const availableSuspects = computed(() => {
    const missionContent = gameStore.currentMissionContent;
    if (!missionContent?.characters) return [];

    return missionContent.characters.map((character: Character) => ({
        id: character.id,
        name: character.name,
        role: character.role,
        isSuspect: character.isSuspect ?? false
    }));
});

const openSuspectSelection = () => {
    showSuspectModal.value = true;
    selectedSuspects.value = [];
};

const closeSuspectModal = () => {
    showSuspectModal.value = false;
    selectedSuspects.value = [];
};

const selectSuspect = (suspectId: string) => {
    const index = selectedSuspects.value.indexOf(suspectId);
    if (index > -1) {
        selectedSuspects.value.splice(index, 1);
    } else {
        selectedSuspects.value.push(suspectId);
    }
};

const confirmSuspect = async () => {
    if (!selectedSuspects.value.length || !gameStore.currentMission) return;

    showSuspectModal.value = false;
    await nexusProcessingStore.confirmSuspect(selectedSuspects.value);
};

const removeEvidence = (evidenceId: string) => {
    if (!gameStore.currentMissionData) return;

    gameStore.toggleEvidence(gameStore.currentMissionData.id, evidenceId);
};

const statusClass = computed(() => {
    const progress = gameStore.currentProgress;

    if (!progress) return 'investigating';

    if (progress.caseStatus === 'completed') return 'completed';

    const evidenceCount = progress.evidenceFound.length;

    if (evidenceCount >= 8) return 'building_case';
    if (evidenceCount >= 5) return 'analyzing';
    if (evidenceCount >= 2) return 'investigating';

    return 'briefing';
});

const statusText = computed(() => {
    const progress = gameStore.currentProgress;
    if (!progress) return 'Under Investigation';

    switch (statusClass.value) {
        case 'completed': return 'Case Closed';
        case 'building_case': return 'Building Case';
        case 'analyzing': return 'Analyzing Evidence';
        case 'investigating': return 'Under Investigation';
        case 'briefing': return 'Reading Briefing';
        default: return 'Under Investigation';
    }
});

const evidenceItems = computed((): EvidenceItem[] => {
    const currentProgress = gameStore.currentProgress;
    const missionContent = gameStore.currentMissionContent;

    const markedEvidence = currentProgress?.markedEvidence || [];

    if (!markedEvidence.length || !missionContent) return [];

    const processEmailContent = (text: string): string => {
        if (!text) return '';
        const username = authStore.currentUser?.username || 'agent';
        return text.replace(/{username}/g, username);
    };

    const findEncryptedSource = (evidenceId: string) => {
        if (!evidenceId.startsWith('crypto_')) return null;

        const missionContent = gameStore.currentMissionContent;
        if (!missionContent) return null;

        const cryptoMessage = missionContent.cryptoMessages?.find((c: CryptoMessage) => c.id === evidenceId);
        if (cryptoMessage) {
            return {
                type: 'crypto',
                content: cryptoMessage.decryptedText || ''
            };
        }

        return null;
    };

    const formatEncryptedDescription = (originalContent: string, evidenceId: string): string => {
        if (evidenceId.startsWith('crypto_')) {
            const source = findEncryptedSource(evidenceId);
            if (source) {
                return `🔓 Successfully decrypted: "${source.content.substring(0, 100)}..." - Decoded using cipher analysis.`;
            }
            return 'Successfully decrypted encrypted communication using cipher analysis.';
        }

        return originalContent.substring(0, 150) + '...';
    };

    const items = markedEvidence.map(evidenceId => {
        const email = missionContent.emails?.find((e: Email) => e.id === evidenceId);
        if (email) {
            const processedSubject = processEmailContent(email.subject || '');
            const processedBody = processEmailContent(email.body || '');
            return {
                id: evidenceId,
                title: `${processedSubject}`,
                description: formatEncryptedDescription(processedBody, evidenceId),
                type: 'Email Evidence',
                icon: '📧',
                discoveredAt: new Date()
            };
        }

        const chat = missionContent.chats?.find((c: Chat) => c.id === evidenceId);
        if (chat) {
            const firstMessage = chat.messages?.[0]?.content || 'No message content';
            return {
                id: evidenceId,
                title: `Chat: ${chat.name || chat.participants?.join(', ') || 'Unknown Chat'}`,
                description: formatEncryptedDescription(firstMessage, evidenceId),
                type: 'Chat Evidence',
                icon: '💬',
                discoveredAt: new Date()
            };
        }

        const file = missionContent.files?.find((f: FileDocument) => f.id === evidenceId);
        if (file) {
            return {
                id: evidenceId,
                title: `${file.name || 'Unknown File'}`,
                description: formatEncryptedDescription(file.content || 'No description available', evidenceId),
                type: 'File Evidence',
                icon: '📄',
                discoveredAt: new Date()
            };
        }

        if (evidenceId.startsWith('crypto_')) {
            const source = findEncryptedSource(evidenceId);
            return {
                id: evidenceId,
                title: '🔓 Decrypted Message',
                description: source ?
                    `🔓 Successfully decrypted: "${source.content}" - Original encrypted content has been decoded using cipher analysis.` :
                    'Successfully decrypted encrypted communication using cipher analysis.',
                type: 'Decrypted Evidence',
                icon: '🔐',
                discoveredAt: new Date()
            };
        }

        return {
            id: evidenceId,
            title: `Evidence Item ${evidenceId}`,
            description: 'This item has been marked as evidence in your investigation.',
            type: 'Investigation Evidence',
            icon: '🔍',
            discoveredAt: new Date()
        };
    });

    return items.toReversed();
});

const revealedTimelineEvents = computed(() => {
    const missionContent = gameStore.currentMissionContent;
    const progress = gameStore.currentProgress;

    if (!missionContent?.timeline || !progress) return [];

    const foundEvidence = progress.evidenceFound || [];
    const readEmails = progress.emailsRead || [];
    const readChats = progress.chatsRead || [];
    const markedEvidence = progress.markedEvidence || [];

    const allRevealedItems = [
        ...foundEvidence,
        ...readEmails,
        ...readChats,
        ...markedEvidence
    ];

    return missionContent.timeline
        .filter((event: MissionEvent) => {
            return event.revealedBy.some((evidenceId: string) =>
                allRevealedItems.includes(evidenceId)
            );
        })
        .sort((a: MissionEvent, b: MissionEvent) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/EvidenceLocker/EvidenceLocker';
</style>