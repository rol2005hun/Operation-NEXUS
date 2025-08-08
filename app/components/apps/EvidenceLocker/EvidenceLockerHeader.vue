<template>
    <div class="evidence-locker-container">
        <div class="evidence-locker-header">
            <h2>🔍 Evidence Locker</h2>
            <div class="case-info" v-if="missionData">
                <span class="case-name">{{ missionData.title }}</span>
                <span class="case-status" :class="statusClass">{{ statusText }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { EvidenceLockerHeaderProps } from '#shared/types';

defineProps<EvidenceLockerHeaderProps>();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/EvidenceLocker/EvidenceLockerHeader';
</style>