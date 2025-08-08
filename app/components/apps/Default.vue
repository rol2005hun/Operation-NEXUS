<template>
  <div class="app-default">
    <div class="error-container">
      <div class="error-header">
        <div class="error-icon">⚠️</div>
        <h2>Unexpected Application State</h2>
        <p class="error-message">You shouldn't be seeing this screen. Please contact the developer immediately.</p>
      </div>

      <div class="contact-info">
        <h3>🔧 Developer Contact</h3>
        <p>Please provide the following information when reporting this issue:</p>
      </div>

      <div class="debug-info">
        <div class="info-section">
          <h4>📊 System Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Current Time:</span>
              <span class="value">{{ currentTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">User Agent:</span>
              <span class="value">{{ userAgent }}</span>
            </div>
            <div class="info-item">
              <span class="label">Screen Resolution:</span>
              <span class="value">{{ screenInfo }}</span>
            </div>
            <div class="info-item">
              <span class="label">Current URL:</span>
              <span class="value">{{ currentUrl }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h4>🎮 Game State</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Current Mission:</span>
              <span class="value">{{ gameStore.currentMission || 'None' }}</span>
            </div>
            <div class="info-item">
              <span class="label">User Authenticated:</span>
              <span class="value">{{ authStore.isAuthenticated ? 'Yes' : 'No' }}</span>
            </div>
            <div class="info-item">
              <span class="label">User ID:</span>
              <span class="value">{{ authStore.currentUser?.id || 'Not logged in' }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h4>🔍 Debug Logs</h4>
          <div class="logs-container">
            <div v-if="consoleLogs.length > 0" class="log-section">
              <h5>Recent Console Output:</h5>
              <div class="log-items">
                <div v-for="(log, index) in consoleLogs.slice(-10)" :key="index" class="log-item" :class="log.type">
                  <span class="log-time">{{ log.time }}</span>
                  <span class="log-content">{{ log.message }}</span>
                </div>
              </div>
            </div>
            <div v-else class="no-logs">
              <p>No recent console logs available</p>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h4>📋 Actions to Take</h4>
          <div class="action-list">
            <div class="action-item">
              <span class="action-number">1.</span>
              <span class="action-text">Screenshot this entire screen</span>
            </div>
            <div class="action-item">
              <span class="action-number">2.</span>
              <span class="action-text">Open browser Developer Tools (F12)</span>
            </div>
            <div class="action-item">
              <span class="action-number">3.</span>
              <span class="action-text">Copy any errors from the Console tab</span>
            </div>
            <div class="action-item">
              <span class="action-number">4.</span>
              <span class="action-text">Note what you were doing when this appeared</span>
            </div>
            <div class="action-item">
              <span class="action-number">5.</span>
              <span class="action-text">Report to developer with all information above</span>
            </div>
          </div>
        </div>

        <div class="export-section">
          <button @click="copyDebugInfo" class="copy-btn">
            📋 Copy Debug Information
          </button>
          <div v-if="copySuccess" class="copy-success">✅ Debug info copied to clipboard!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore();
const authStore = useAuthStore();

const currentTime = ref('');
const userAgent = ref('');
const screenInfo = ref('');
const currentUrl = ref('');
const consoleLogs = ref<Array<{ type: string, message: string, time: string }>>([]);
const copySuccess = ref(false);

const updateTime = () => {
  currentTime.value = new Date().toISOString();
};

const collectSystemInfo = () => {
  userAgent.value = navigator.userAgent;
  screenInfo.value = `${screen.width}x${screen.height} (${window.innerWidth}x${window.innerHeight})`;
  currentUrl.value = window.location.href;
};

const interceptConsoleLogs = () => {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => {
    consoleLogs.value.push({
      type: 'log',
      message: args.join(' '),
      time: new Date().toLocaleTimeString()
    });
    originalLog.apply(console, args);
  };

  console.error = (...args) => {
    consoleLogs.value.push({
      type: 'error',
      message: args.join(' '),
      time: new Date().toLocaleTimeString()
    });
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    consoleLogs.value.push({
      type: 'warn',
      message: args.join(' '),
      time: new Date().toLocaleTimeString()
    });
    originalWarn.apply(console, args);
  };
};

const copyDebugInfo = async () => {
  const debugInfo = {
    timestamp: currentTime.value,
    userAgent: userAgent.value,
    screenInfo: screenInfo.value,
    currentUrl: currentUrl.value,
    gameState: {
      currentMission: gameStore.currentMission,
      isAuthenticated: authStore.isAuthenticated,
      username: authStore.currentUser?.username
    },
    recentLogs: consoleLogs.value.slice(-10)
  };

  try {
    await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error('Failed to copy debug info:', err);
  }
};

onMounted(() => {
  updateTime();
  collectSystemInfo();
  interceptConsoleLogs();

  setInterval(updateTime, 1000);
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/Default';
</style>