<template>
    <div class="complete-investigation">
        <button class="complete-btn" @click="$emit('click')">
            🎯 Identify Suspects
        </button>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    click: []
}>();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/EvidenceLocker/CompleteInvestigationButton';
</style>
