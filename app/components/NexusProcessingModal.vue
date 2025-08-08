<template>
    <div v-if="isVisible" class="nexus-processing-modal-overlay" @click="handleOverlayClick">
        <div class="nexus-processing-modal" @click.stop>
            <div class="processing-content">
                <div class="nexus-header">
                    <div class="nexus-logo">🏛️</div>
                    <h2>NEXUS INVESTIGATION SYSTEM</h2>
                    <div class="system-status">{{ processingStatus }}</div>
                </div>

                <div class="processing-grid">
                    <div class="processing-section">
                        <div class="section-header">
                            <span class="section-icon">🔍</span>
                            <span class="section-title">EVIDENCE ANALYSIS</span>
                            <span class="section-status"
                                :class="{ 'active': currentStep >= 1, 'complete': currentStep > 1 }">
                                {{ currentStep >= 1 ? (currentStep > 1 ? 'COMPLETE' : 'PROCESSING') : 'WAITING' }}
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: currentStep >= 1 ? '100%' : '0%' }"></div>
                        </div>
                    </div>

                    <div class="processing-section">
                        <div class="section-header">
                            <span class="section-icon">👤</span>
                            <span class="section-title">SUSPECT VERIFICATION</span>
                            <span class="section-status"
                                :class="{ 'active': currentStep >= 2, 'complete': currentStep > 2 }">
                                {{ currentStep >= 2 ? (currentStep > 2 ? 'COMPLETE' : 'PROCESSING') : 'WAITING' }}
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: currentStep >= 2 ? '100%' : '0%' }"></div>
                        </div>
                    </div>

                    <div class="processing-section">
                        <div class="section-header">
                            <span class="section-icon">🗄️</span>
                            <span class="section-title">DATABASE LOOKUP</span>
                            <span class="section-status"
                                :class="{ 'active': currentStep >= 3, 'complete': currentStep > 3 }">
                                {{ currentStep >= 3 ? (currentStep > 3 ? 'COMPLETE' : 'PROCESSING') : 'WAITING' }}
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: currentStep >= 3 ? '100%' : '0%' }"></div>
                        </div>
                    </div>

                    <div class="processing-section">
                        <div class="section-header">
                            <span class="section-icon">📊</span>
                            <span class="section-title">SCORE CALCULATION</span>
                            <span class="section-status"
                                :class="{ 'active': currentStep >= 4, 'complete': currentStep > 4 }">
                                {{ currentStep >= 4 ? (currentStep > 4 ? 'COMPLETE' : 'PROCESSING') : 'WAITING' }}
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: currentStep >= 4 ? '100%' : '0%' }"></div>
                        </div>
                    </div>
                </div>

                <div class="processing-info">
                    <div class="processing-text">{{ processingText }}</div>
                    <div class="processing-dots" v-if="!processingError">
                        <span class="dot" :class="{ active: dotIndex === 0 }">●</span>
                        <span class="dot" :class="{ active: dotIndex === 1 }">●</span>
                        <span class="dot" :class="{ active: dotIndex === 2 }">●</span>
                    </div>

                    <div v-if="processingError" class="processing-error">
                        <div class="error-icon">⚠️</div>
                        <div class="error-message">
                            <h4>SYSTEM ERROR DETECTED</h4>
                            <p>{{ processingText }}</p>
                            <div class="error-actions">
                                <button class="retry-btn" @click="$emit('retry')">
                                    🔄 Retry Investigation
                                </button>
                                <button class="cancel-btn" @click="$emit('cancel')">
                                    ❌ Return to Main Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NexusProcessingModalProps } from '#shared/types';

const props = defineProps<NexusProcessingModalProps>();

const emit = defineEmits<{
    retry: []
    cancel: []
    close: []
}>();

const handleOverlayClick = () => {
    if (!props.processingError) return;
    emit('close');
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/NexusProcessingModal';
</style>
