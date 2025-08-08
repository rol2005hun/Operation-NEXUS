<template>
    <div class="document-reader">
        <div class="document-reader-header">
            <div class="document-info" v-if="currentFile">
                <div class="header-main">
                    <h2>{{ currentFile.name }}</h2>
                    <button v-if="currentFile" class="mark-evidence-btn"
                        :class="{ 'marked': isMarkedAsEvidence(currentFile.id) }"
                        @click="toggleEvidence(currentFile.id)">
                        {{ isMarkedAsEvidence(currentFile.id) ? '🔍 Evidence' : '🔍 Mark as Evidence' }}
                    </button>
                </div>
                <div class="document-meta">
                    <span class="file-type">{{ getFileTypeLabel(currentFile.type) }}</span>
                    <span class="file-size">{{ currentFile.size }}</span>
                    <span class="last-modified">Modified: {{ formatDate(currentFile.lastModified) }}</span>
                    <span class="author">Author: {{ currentFile.author }}</span>
                </div>
            </div>
            <div class="no-document" v-else>
                <h2>File Viewer</h2>
                <p>No document selected</p>
            </div>
        </div>

        <div class="document-content" v-if="currentFile">
            <div class="content-wrapper" v-html="formatMarkdown(currentFile.content)"></div>
        </div>

        <div class="no-content" v-else>
            <div class="empty-state">
                <div class="empty-icon">📄</div>
                <h3>No Document Opened</h3>
                <p>Open a document from Email attachments, or Chat attachments to view it here.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const laptopStore = useLaptopStore();
const gameStore = useGameStore();

const currentFile = computed(() => {
    if (!laptopStore.currentDocument || !gameStore.currentMissionContent) {
        return null;
    }

    return gameStore.currentMissionContent.files.find((file: FileDocument) =>
        file.id === laptopStore.currentDocument
    ) || null;
});

const getFileTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
        'document': 'Document',
        'spreadsheet': 'Spreadsheet',
        'image': 'Image',
        'video': 'Video',
        'audio': 'Audio',
        'archive': 'Archive'
    };
    return typeLabels[type] || 'File';
};

const isMarkedAsEvidence = (fileId: string) => {
    if (!gameStore.currentMissionData || !gameStore.currentProgress) return false;
    return gameStore.currentProgress.markedEvidence.includes(fileId);
};

const toggleEvidence = (fileId: string) => {
    if (!gameStore.currentMissionData) return;
    gameStore.toggleEvidence(gameStore.currentMissionData.id, fileId);
};

const handleOpenFile = (event: CustomEvent) => {
    const { fileId } = event.detail;
    laptopStore.currentDocument = fileId;
};

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('openFile', handleOpenFile as EventListener);
    }
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('openFile', handleOpenFile as EventListener);
    }
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/FileReader';
</style>