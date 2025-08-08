<template>
    <div class="evidence-tab">
        <div v-if="usePremium().canAccessPremiumFeatures.value" class="progress-section">
            <h3>🔍 Investigation Status</h3>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${investigationProgress}%` }" :class="progressClass"></div>
            </div>
            <div class="progress-status">
                <span class="status-text">{{ progressStatusText }}</span>
            </div>
        </div>

        <div class="evidence-section">
            <h3>📄 Collected Evidence</h3>
            <div class="evidence-list">
                <div v-if="evidenceItems.length === 0" class="no-evidence">
                    <p>You haven't collected any evidence yet.</p>
                </div>

                <div v-for="evidence in evidenceItems" :key="evidence.id" class="evidence-item important">
                    <div class="evidence-icon">{{ evidence.icon }}</div>
                    <div class="evidence-details">
                        <h4>{{ evidence.title }}</h4>
                        <p>{{ evidence.description }}</p>
                        <div class="evidence-meta">
                            <span class="evidence-type">{{ evidence.type }}</span>
                            <span class="evidence-time">{{ formatTime(evidence.discoveredAt) }}</span>
                        </div>
                    </div>
                    <div class="evidence-actions">
                        <button class="delete-evidence-btn" @click="$emit('removeEvidence', evidence.id)"
                            title="Remove from evidence">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { EvidenceTabProps } from '#shared/types';

defineProps<EvidenceTabProps>();

defineEmits<{
    removeEvidence: [evidenceId: string]
}>();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/EvidenceLocker/EvidenceTab';
</style>