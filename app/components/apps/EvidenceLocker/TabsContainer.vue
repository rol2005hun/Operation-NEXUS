<template>
    <div class="tabs-container">
        <div class="tabs">
            <button class="tab" :class="{ active: activeTab === 'evidence' }"
                @click="$emit('update:activeTab', 'evidence')">
                🔍 Evidence
            </button>
            <button class="tab" :class="{ active: activeTab === 'timeline' }"
                @click="$emit('update:activeTab', 'timeline')">
                📅 Timeline
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TabsContainerProps } from '#shared/types';

defineProps<TabsContainerProps>();

defineEmits<{
    'update:activeTab': [tab: string]
}>();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/EvidenceLocker/TabsContainer';
</style>