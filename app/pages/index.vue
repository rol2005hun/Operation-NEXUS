<template>
    <div class="main-menu">
        <div class="background">
            <div class="overlay"></div>
        </div>

        <header class="header">
            <div class="logo">
                <div class="logo-title-container">
                    <span class="logo-operation">Operation:</span>
                    <span class="logo-nexus">NEXUS</span>
                </div>
                <p>Digital Investigation Agency</p>
            </div>
            <div class="user-info">
                <div v-if="authStore.isAuthenticated" class="agent-profile">
                    <div class="agent-details">
                        <span class="agent-name">{{ gameStore.agent.name }}</span>
                        <span class="agent-rank" :class="gameStore.agent.rank.toLowerCase().replace(' ', '-')">{{
                            gameStore.agent.rank }}</span>
                        <span class="agent-dept">{{ gameStore.agent.department }}</span>
                        <span class="clearance">Security Clearance: {{ gameStore.agent.clearanceLevel }}</span>
                    </div>
                </div>
                <div v-if="authStore.isAuthenticated" class="user-actions">
                    <button @click="goToSettings" class="agent-badge">{{ gameStore.agent.badge }}</button>
                    <button class="logout-btn" @click="handleLogout" title="Logout">
                        🚪 Logout
                    </button>
                </div>
                <button v-else class="login-btn" @click="navigateToLogin" title="Sign In">
                    🔐 Sign In
                </button>
            </div>
        </header>

        <main class="content">
            <div class="intro-section">
                <h2>Choose Your Mission</h2>
                <p>Every case is a new challenge. Use digital tools and your investigative instincts to solve them.</p>
            </div>

            <div class="mission-controls">
                <div class="control-group">
                    <div class="sort-controls">
                        <label for="sort-select">Sort by:</label>
                        <select id="sort-select" v-model="sortBy" class="control-select">
                            <option value="clearance">Security Clearance</option>
                            <option value="difficulty">Difficulty Level</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </div>
                    <div class="filter-controls">
                        <label for="filter-select">Filter by:</label>
                        <select id="filter-select" v-model="filterBy" class="control-select">
                            <option value="all">All Missions</option>
                            <option value="available">Available Only</option>
                            <option value="clearance">My Clearance Level</option>
                            <option value="difficulty-rookie">Rookie Difficulty</option>
                            <option value="difficulty-agent">Agent Difficulty</option>
                            <option value="difficulty-senior">Senior Agent+</option>
                            <option value="purchased">Purchased</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div class="mission-count">
                        <span class="count-label">Showing:</span>
                        <span class="count-value">{{ sortedMissions.length }} / {{ gameStore.missions.length }}</span>
                    </div>
                </div>
            </div>

            <div class="missions-grid">
                <div v-for="mission in sortedMissions" :key="mission.id" class="mission-card" :class="{
                    completed: isMissionCompleted(mission.id),
                    disabled: !mission.available || !authStore.isAuthenticated,
                    'clearance-locked': authStore.isAuthenticated && mission.securityClearance > gameStore.agent.clearanceLevel,
                    'just-completed': showCompletionAnimation && justCompletedMissionId === mission.id
                }"
                    @click="authStore.isAuthenticated && authStore.canAccessMission(mission) ? selectMission(mission.id) : null">
                    <div class="mission-thumbnail">
                        <div class="mission-icon">{{ mission.icon }}</div>
                        <div v-if="isMissionCompleted(mission.id)" class="completed-badge">✓</div>
                        <div v-if="!mission.available" class="locked-badge">🔒</div>
                        <div v-if="!authStore.isAuthenticated && mission.id !== 'the-internal-leak'"
                            class="auth-required-badge">🔐</div>
                        <div v-if="!authStore.isAuthenticated && mission.id === 'the-internal-leak'"
                            class="preview-badge">👁️
                        </div>
                        <div v-else-if="authStore.isAuthenticated && mission.securityClearance > gameStore.agent.clearanceLevel"
                            class="clearance-badge">
                            CL{{ mission.securityClearance }}
                        </div>
                    </div>

                    <div class="mission-info">
                        <h3>{{ mission.title }}</h3>
                        <p class="mission-description">
                            {{ getMissionDescription(mission) }}
                        </p>

                        <div class="mission-footer">
                            <div class="mission-meta">
                                <span class="difficulty" :class="mission.difficulty.toLowerCase().replace(' ', '-')">
                                    {{ mission.difficulty }}
                                </span>
                                <span class="time">{{ mission.estimatedTime }}</span>
                                <span class="clearance">CL{{ mission.securityClearance }}</span>
                            </div>

                            <div v-if="authStore.isAuthenticated && mission.available && authStore.canAccessMission(mission)"
                                class="mission-briefing">
                                <button class="briefing-btn" @click.stop="showBriefing(mission)">📋 View
                                    Briefing</button>
                            </div>
                            <div v-else-if="mission.id === 'the-internal-leak'" class="mission-briefing">
                                <button class="preview-briefing-btn" @click.stop="showBriefing(mission)">👁️ Preview
                                    Briefing</button>
                            </div>
                            <div v-else-if="!authStore.isAuthenticated" class="mission-briefing">
                                <button class="auth-required-btn" @click.stop="navigateToLogin">🔐 Sign In
                                    Required</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats">
                <div class="stat">
                    <span class="stat-value">{{ completedMissionsCount }}</span>
                    <span class="stat-label">Completed Cases</span>
                </div>
                <div class="stat">
                    <span class="stat-value">{{ purchasedMissionsCount }}</span>
                    <span class="stat-label">Available Cases</span>
                </div>
                <div class="stat">
                    <span class="stat-value">{{ totalMissionsCount }}</span>
                    <span class="stat-label">Total Cases</span>
                </div>
            </div>
        </main>

        <div v-if="showBriefingModal" class="briefing-modal" @click="closeBriefing">
            <div class="briefing-content" @click.stop>
                <div class="briefing-header">
                    <h2>🔒 CLASSIFIED BRIEFING</h2>
                    <button class="close-btn" @click="closeBriefing">✕</button>
                </div>

                <div v-if="selectedMission" class="briefing-body">
                    <div class="mission-title">
                        <h3>{{ selectedMission.title }}</h3>
                        <div class="clearance-info">
                            <span class="clearance-level">Security Clearance: {{ selectedMission.securityClearance
                            }}</span>
                            <span class="difficulty">{{ selectedMission.difficulty }}</span>
                        </div>
                    </div>

                    <div class="mission-briefing">
                        <h4>Mission Briefing:</h4>
                        <div v-html="formatMarkdown(selectedMission.briefing)" class="classified-briefing"></div>
                    </div>

                    <div class="mission-objectives">
                        <h4>Primary Objectives:</h4>
                        <ul>
                            <li>Analyze all available digital evidence</li>
                            <li>Identify suspects and their connections</li>
                            <li>Build a comprehensive case timeline</li>
                            <li>Confirm primary suspect for arrest warrant</li>
                        </ul>
                    </div>

                    <div class="mission-tools">
                        <h4>Available Tools:</h4>
                        <div class="tools-list">
                            <span class="tool">📧 Email Analysis</span>
                            <span class="tool">💬 Communication Logs</span>
                            <span class="tool">📁 File Explorer</span>
                            <span class="tool">🔍 Evidence Locker</span>
                            <span class="tool">📝 Investigation Notes</span>
                        </div>
                    </div>

                    <div class="mission-warning">
                        <p>⚠️ This is a classified operation. Handle all evidence with appropriate security protocols.
                        </p>
                    </div>

                    <div class="briefing-actions">
                        <button class="cancel-btn" @click="closeBriefing">Cancel</button>
                        <button
                            v-if="authStore.isAuthenticated && selectedMission && authStore.canAccessMission(selectedMission)"
                            class="start-mission-btn" @click="startMission">
                            🚀 Start Mission
                        </button>
                        <button
                            v-else-if="authStore.isAuthenticated && selectedMission && !authStore.canAccessMission(selectedMission)"
                            class="start-mission-btn disabled" disabled
                            title="Insufficient clearance or mission not purchased">
                            🔒 Mission Locked
                        </button>
                        <button v-else class="login-mission-btn" @click="navigateToLogin">
                            🔐 Sign In to Start Mission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <transition name="laptop-boot">
        <LaptopScreen v-if="authStore.isAuthenticated && gameStore.isInLaptop" />
    </transition>
</template>

<script setup lang="ts">
const gameStore = useGameStore();
const authStore = useAuthStore();
const showBriefingModal = ref(false);
const selectedMission = ref<Mission | null>(null);
const sortBy = ref<'clearance' | 'difficulty' | 'alphabetical'>('clearance');
const filterBy = ref<'all' | 'available' | 'clearance' | 'difficulty-rookie' | 'difficulty-agent' | 'difficulty-senior' | 'purchased' | 'completed'>('all');
const justCompletedMissionId = ref<string | null>(null);
const showCompletionAnimation = ref(false);

const { isCompletionModalVisible, completionData } = useMissionCompletion();

watch(isCompletionModalVisible, (newValue, oldValue) => {
    if (oldValue && !newValue && completionData.value?.missionId) {
        triggerCompletionAnimation(completionData.value.missionId);
    }
});

const triggerCompletionAnimation = (missionId: string) => {
    if (authStore.user) {
        const scoresMapRaw = authStore.user.gameProgress.missionScores;
        let scoresMap: Map<string, number>;
        if (scoresMapRaw instanceof Map) {
            scoresMap = scoresMapRaw;
        } else {
            scoresMap = new Map(Object.entries(scoresMapRaw ?? {}));
        }
        if (!scoresMap.has(missionId) || (scoresMap.get(missionId) ?? 0) <= 0) {
            scoresMap.set(missionId, 100);
            authStore.user.gameProgress.missionScores = scoresMap;
        }
    }

    justCompletedMissionId.value = missionId;
    showCompletionAnimation.value = true;

    setTimeout(() => {
        showCompletionAnimation.value = false;
        justCompletedMissionId.value = null;
    }, 4000);
};

onMounted(() => {
    const completedMissionId = sessionStorage.getItem('justCompletedMission');
    if (completedMissionId) {
        sessionStorage.removeItem('justCompletedMission');
        triggerCompletionAnimation(completedMissionId);
    }

    const handleMissionCompleted = (event: CustomEvent) => {
        triggerCompletionAnimation(event.detail.missionId);
    };

    window.addEventListener('missionCompleted', handleMissionCompleted as EventListener);
});

const completedMissionsCount = computed(() =>
    (() => {
        const scoresMapRaw = authStore.user?.gameProgress.missionScores;
        let scoresMap: Map<string, number>;
        if (scoresMapRaw instanceof Map) {
            scoresMap = scoresMapRaw;
        } else {
            scoresMap = new Map(Object.entries(scoresMapRaw ?? {}));
        }
        return Array.from(scoresMap.values()).filter(score => typeof score === 'number' && score >= 0).length;
    })()
);

const purchasedMissionsCount = computed(() =>
    Math.min(authStore.user?.gameProgress.purchasedMissions.length || 0, gameStore.availableMissions.length)
);

const totalMissionsCount = computed(() =>
    gameStore.missions.length
);

const sortedMissions = computed(() => {
    let missions = gameStore.getAvailableMissionsSorted(sortBy.value);

    switch (filterBy.value) {
        case 'available':
            missions = missions.filter(mission => mission.available);
            break;

        case 'clearance':
            missions = missions.filter(mission =>
                mission.securityClearance <= gameStore.agent.clearanceLevel
            );
            break;

        case 'difficulty-rookie':
            missions = missions.filter(mission =>
                mission.difficulty === 'Rookie' || mission.difficulty === 'Agent'
            );
            break;

        case 'difficulty-agent':
            missions = missions.filter(mission =>
                mission.difficulty === 'Agent' || mission.difficulty === 'Senior Agent'
            );
            break;

        case 'difficulty-senior':
            missions = missions.filter(mission =>
                ['Senior Agent', 'Special Agent', 'Supervisor', 'Section Chief', 'Deputy Director', 'Director'].includes(mission.difficulty)
            );
            break;

        case 'purchased':
            missions = missions.filter(mission =>
                authStore.user?.gameProgress.purchasedMissions.includes(mission.id) || false
            );
            break;

        case 'completed':
            missions = missions.filter(mission => {
                let scoresMapRaw = authStore.user?.gameProgress.missionScores;
                let scoresMap: Map<string, number>;
                if (scoresMapRaw instanceof Map) {
                    scoresMap = scoresMapRaw;
                } else {
                    scoresMap = new Map(Object.entries(scoresMapRaw ?? {}));
                }
                return scoresMap.has(mission.id) && (scoresMap.get(mission.id) ?? 0) >= 0;
            });
            break;

        case 'all':
        default:
            break;
    }

    return missions;
});

const isMissionCompleted = (missionId: string): boolean => {
    const localProgress = gameStore.progress[missionId];
    const isLocallyCompleted = localProgress?.caseStatus === 'completed';
    let scoresMapRaw = authStore.user?.gameProgress.missionScores;
    let scoresMap: Map<string, number>;
    if (scoresMapRaw instanceof Map) {
        scoresMap = scoresMapRaw;
    } else {
        scoresMap = new Map(Object.entries(scoresMapRaw ?? {}));
    }
    const isServerCompleted = !!(scoresMap.has(missionId) && (scoresMap.get(missionId) ?? 0) >= 0);

    return Boolean(isLocallyCompleted) || isServerCompleted;
};

const selectMission = (missionId: string) => {
    gameStore.selectMission(missionId);
};

const getMissionDescription = (mission: Mission): string => {
    if (!authStore.isAuthenticated) {
        if (mission.id === 'the-internal-leak') {
            return 'Someone within our organization is leaking confidential documents to external parties. Investigate emails, messages, and file access logs to identify the mole.';
        }
        return 'Sign in to access this classified case.';
    }
    if (!mission.available) {
        return 'Coming Soon - This case is not yet available.';
    }
    if (!authStore.canAccessMission(mission)) {
        if (mission.securityClearance > gameStore.agent.clearanceLevel) {
            return `Insufficient security clearance. Required: Level ${mission.securityClearance}`;
        }
        return `Premium case - $${mission.price} to unlock`;
    }
    return mission.description;
};

const showBriefing = (mission: Mission) => {
    selectedMission.value = mission;
    showBriefingModal.value = true;
};

const closeBriefing = () => {
    showBriefingModal.value = false;
    selectedMission.value = null;
};

const handleLogout = async () => {
    authStore.logout();
    await navigateTo('/');
};

const navigateToLogin = () => {
    navigateTo('/auth');
};

const goToSettings = () => {
    navigateTo('/settings');
};

const startMission = () => {
    if (selectedMission.value) {
        selectMission(selectedMission.value.id);
        closeBriefing();
    }
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/pages/index';
</style>