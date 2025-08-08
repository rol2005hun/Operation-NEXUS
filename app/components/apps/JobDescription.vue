<template>
  <div class="app-job-description">
    <div class="job-description-header" v-if="currentMissionContent">
      <h2>💼 Case Assignment - {{ currentMissionContent.setting.organization }} Investigation</h2>
      <div class="job-description-meta">
        <span class="case-id">Case ID: {{ gameStore.currentMission?.toUpperCase() }}</span>
        <span class="classification">Classification: TOP SECRET</span>
      </div>
    </div>

    <div class="job-description-content" v-if="currentMissionContent">
      <div class="investigation-brief">
        <h3>🎯 Mission Assignment</h3>
        <div class="mission-briefing" v-if="missionMetadata?.briefing"
          v-html="formatMarkdown(missionMetadata.briefing)"></div>

        <p v-else>
          Agent, you have been assigned to investigate a suspected data breach at <strong>{{
            currentMissionContent.setting.organization }}</strong>.
        </p>

        <h4>📋 Incident Report</h4>
        <p>{{ currentMissionContent.setting.backgroundInfo }}</p>

        <div class="case-details">
          <p><strong>Location:</strong> {{ currentMissionContent.setting.location }}</p>
          <p><strong>Affected Department:</strong> {{ currentMissionContent.setting.department }}</p>
          <p><strong>Investigation Period:</strong> {{ currentMissionContent.setting.timeframe }}</p>
        </div>

        <h4>📜 Your Mission</h4>
        <div class="mission-objectives">
          <ol>
            <li v-for="objective in currentMissionContent.objectives" :key="objective.id">
              <strong>{{ objective.title }}:</strong> {{ objective.description }}
            </li>
          </ol>
        </div>

        <h4>🧾 Investigation Protocol</h4>
        <div class="protocol-box">
          <p>
            You have access to the following investigation tools and data sources:
          </p>
          <div class="tools-grid" v-if="availableTools.length > 0">
            <div v-for="tool in availableTools" :key="tool.id" class="tool-item">
              <div class="tool-header">
                <strong>{{ tool.name }}</strong>
              </div>
              <div class="tool-description">
                {{ tool.description }}
              </div>
            </div>
          </div>
          <p v-else class="loading-text">
            <em>Loading available investigation tools...</em>
          </p>
          <div class="investigation-focus">
            <p>
              <strong>Investigation Focus:</strong> Look for patterns in communication timing, unusual file transfers,
              financial motivations, and encrypted messages that may reveal insider threats.
            </p>
          </div>
        </div>

        <h4>⚠️ Security Notice</h4>
        <div class="warning-box">
          <p>
            This investigation involves classified defense technology. Maintain operational security at all times.
            The compromise of sensitive data poses a significant threat to national security.
          </p>
        </div>

        <div class="final-instructions">
          <h4>🎯 Investigation Instructions</h4>
          <p class="emphasis">
            <strong>Your mission is to identify the perpetrator responsible for the security breach.</strong>
          </p>
          <p class="emphasis"
            v-if="currentMissionContent?.cryptoMessages && currentMissionContent.cryptoMessages.length > 0">
            <strong>Remember:</strong> Some critical evidence may be hidden in encrypted communications.
            Don't overlook coded messages or cipher text that could reveal the full scope of the breach.
          </p>
          <p class="emphasis">
            <strong>Good luck, Agent. The security of classified technology depends on your investigation.</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore();

const currentMissionContent = ref<MissionContent | null>(null);
const missionMetadata = ref<Mission | null>(null);
const availableTools = ref<MissionApp[]>([]);

const initializeJobDescription = async () => {
  try {
    currentMissionContent.value = gameStore.getCurrentMissionContent();

    if (gameStore.currentMission) {
      if (!import.meta.client) {
        const { missionMetadata: metadata } = await import(`@/missions/${gameStore.currentMission}/metadata.ts`);
        missionMetadata.value = metadata;
      }

      await loadAvailableTools();
    }
  } catch (error) {
    console.error('JobDescription: Error loading mission content:', error);
  }
};

const loadAvailableTools = async () => {
  try {
    const { getAppById, getDefaultApps } = await import('@/utils/appRegistry');

    const missionApps = currentMissionContent.value?.availableApps || [];
    const defaultApps = getDefaultApps();
    const allAvailableApps = [...new Set([...defaultApps, ...missionApps])];

    availableTools.value = allAvailableApps
      .map(appId => {
        const app = getAppById(appId);
        return app ? {
          id: app.id,
          name: app.name,
          description: app.description
        } : null;
      })
      .filter((tool): tool is MissionApp => tool !== null);
  } catch (error) {
    console.error('JobDescription: Error loading available tools:', error);
  }
};

onMounted(() => {
  initializeJobDescription();
});

watch(() => gameStore.currentMission, () => {
  initializeJobDescription();
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/JobDescription';
</style>