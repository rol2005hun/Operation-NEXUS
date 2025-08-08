<template>
    <div class="suspect-selection-modal" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>🎯 Suspect Identification</h3>
                <button class="close-btn" @click="$emit('close')">✕</button>
            </div>

            <div class="modal-body">
                <div class="modal-description">
                    <p>Based on your investigation and the evidence collected, who do you believe is responsible for the
                        data
                        breach?</p>
                </div>

                <div class="suspects-container">
                    <div class="suspects-grid">
                        <div v-for="suspect in availableSuspects" :key="suspect.id" class="suspect-card"
                            :class="{ 'selected': selectedSuspects.includes(suspect.id) }"
                            @click="$emit('selectSuspect', suspect.id)">
                            <div class="suspect-avatar">👤</div>
                            <div class="suspect-info">
                                <h4>{{ suspect.name }}</h4>
                                <p class="suspect-role">{{ suspect.role }}</p>
                            </div>
                            <div v-if="selectedSuspects.includes(suspect.id)" class="selected-indicator">✓</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="cancel-btn" @click="$emit('close')">
                    Cancel
                </button>
                <button class="confirm-btn" :disabled="!selectedSuspects.length" @click="$emit('confirm')">
                    Confirm Selection
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SuspectSelectionModalProps } from '#shared/types';

defineProps<SuspectSelectionModalProps>();

defineEmits<{
    close: []
    selectSuspect: [suspectId: string]
    confirm: []
}>();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/EvidenceLocker/SuspectSelectionModal';
</style>