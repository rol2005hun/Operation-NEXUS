<template>
    <div class="timeline-tab">
        <div class="timeline-header">
            <h3>📅 Investigation Timeline</h3>
            <p>Key events discovered during the investigation</p>
        </div>

        <div class="timeline">
            <div v-for="event in revealedTimelineEvents" :key="event.id" class="timeline-event">
                <div class="timeline-marker"></div>
                <div class="timeline-content-item">
                    <div class="timeline-header">
                        <h4>{{ event.title }}</h4>
                        <span class="timeline-time">{{ formatDate(event.timestamp) }}</span>
                    </div>
                    <p class="timeline-description">{{ event.description }}</p>
                    <div class="timeline-meta">
                        <div class="timeline-participants">
                            <span class="timeline-label">Participants:</span>
                            {{ event.participants.join(', ') }}
                        </div>
                        <div class="timeline-location">
                            <span class="timeline-label">Location:</span>
                            {{ event.location }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="revealedTimelineEvents.length === 0" class="timeline-empty">
                <p>📋 No timeline events have been revealed yet.</p>
                <p>Continue investigating to uncover the sequence of events.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TimelineTabProps } from '#shared/types';

defineProps<TimelineTabProps>();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/EvidenceLocker/TimelineTab';
</style>