<template>
    <div v-if="isVisible" class="start-menu-overlay" @click="hideMenu">
        <div class="start-menu" :class="{ 'animating-out': isAnimatingOut }" @click.stop>
            <div class="start-menu-header">
                <div class="nexus-logo-large">
                    <div class="logo-diamond">◆</div>
                    <div class="logo-lines">
                        <span class="line line-1"></span>
                        <span class="line line-2"></span>
                        <span class="line line-3"></span>
                    </div>
                </div>
                <div class="nexus-branding">
                    <h3>NEXUS</h3>
                    <span>{{ authStore.currentUser?.agent?.name || authStore.currentUser?.username || 'Agent' }}</span>
                </div>
            </div>

            <div class="start-menu-content">
                <div class="menu-section">
                    <h4>System</h4>
                    <div class="menu-items">
                        <button class="menu-item" @click="openApp('settings')">
                            <span class="menu-icon">⚙️</span>
                            <span class="menu-text">Settings</span>
                            <span class="menu-arrow">›</span>
                        </button>
                    </div>
                </div>

                <div class="menu-section">
                    <h4>Applications</h4>
                    <div class="menu-items">
                        <button v-for="app in quickAccessApps" :key="app.id" class="menu-item" @click="openApp(app.id)">
                            <span class="menu-icon">{{ app.icon }}</span>
                            <span class="menu-text">{{ app.name }}</span>
                            <span class="menu-arrow">›</span>
                        </button>
                        <div v-if="quickAccessApps.length === 0" class="menu-item disabled">
                            <span class="menu-icon">📱</span>
                            <span class="menu-text">No applications available</span>
                        </div>
                    </div>
                </div>

                <div class="menu-section">
                    <h4>Mission Control</h4>
                    <div class="menu-items">
                        <button class="menu-item" @click="openApp('jobDescription')">
                            <span class="menu-icon">💼</span>
                            <span class="menu-text">Current Mission</span>
                            <span class="menu-arrow">›</span>
                        </button>

                        <button class="menu-item" @click="openApp('evidenceLocker')">
                            <span class="menu-icon">🔍</span>
                            <span class="menu-text">Evidence Locker</span>
                            <span class="menu-arrow">›</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="start-menu-footer">
                <button class="power-button exit-btn" @click="exitLaptop" title="Exit NEXUS System">
                    <span class="power-icon">⏻</span>
                    <span class="power-text">Exit System</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const laptopStore = useLaptopStore();
const gameStore = useGameStore();
const authStore = useAuthStore();

const isVisible = ref(false);
const isAnimatingOut = ref(false);

const quickAccessApps = computed(() => {
    return laptopStore.availableApps
        .filter(app => !['settings', 'jobDescription', 'evidenceLocker'].includes(app.id))
        .sort((a, b) => a.name.localeCompare(b.name));
});

const showMenu = () => {
    isVisible.value = true;
};

const hideMenu = () => {
    if (isVisible.value && !isAnimatingOut.value) {
        isAnimatingOut.value = true;
        setTimeout(() => {
            isVisible.value = false;
            isAnimatingOut.value = false;
        }, 150);
    }
};

const toggleMenu = () => {
    isVisible.value = !isVisible.value;
};

const openApp = (appId: string) => {
    laptopStore.openApp(appId);
    hideMenu();
};

const exitLaptop = () => {
    const currentMission = gameStore.currentMission;
    const progress = gameStore.currentProgress;

    const missionId = currentMission;
    const isCompleted = progress?.caseStatus === 'completed';

    gameStore.exitLaptop();

    if (missionId && isCompleted) {
        window.dispatchEvent(new CustomEvent('missionCompleted', {
            detail: { missionId: missionId }
        }));
    }

    hideMenu();
};

defineExpose({
    showMenu,
    hideMenu,
    toggleMenu
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/StartMenu';
</style>