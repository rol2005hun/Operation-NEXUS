<template>
    <div v-if="isCompletionModalVisible" class="completion-modal-overlay" @click="handleOverlayClick">
        <div class="completion-modal" @click.stop>
            <div class="completion-header">
                <div class="mission-complete-badge">
                    <div class="badge-content">
                        <span class="mission-text">MISSION</span>
                        <span class="complete-text">COMPLETE</span>
                    </div>
                </div>
                <h2 class="case-title">{{ completionData?.missionTitle }}</h2>
            </div>

            <div class="completion-content">
                <div class="score-section">
                    <div class="final-score">
                        <span class="score-label">Final Investigation Score</span>
                        <span class="score-value">{{ completionData?.score || 0 }}</span>
                    </div>

                    <div class="rank-achieved">
                        <span class="rank-label">Rank Achieved:</span>
                        <span class="rank-value" :style="{ color: completionData?.rank.color }">
                            {{ completionData?.rank.rank }}
                        </span>
                    </div>

                    <p class="rank-description">
                        {{ completionData?.rank.description }}
                    </p>
                </div>

                <div class="case-summary">
                    <h3>Case Summary</h3>
                    <p v-if="completionData?.missionId === 'the-internal-leak'">
                        You successfully identified Aaron Cole as the perpetrator of the Sentinel-X data breach.
                        Through careful analysis of network logs, chat communications, and financial records,
                        you uncovered his motivation and exposed the $75,000 payment from Alex Thompson.
                    </p>
                </div>

                <div class="support-section">
                    <div class="support-message">
                        <h3>🎉 Thank you for playing the game DEMO!</h3>
                        <p>
                            If you discovered any bugs, have ideas, or any other questions,
                            <strong>join our Discord server</strong> or
                            <strong>contact us via email!</strong>
                        </p>

                        <div class="contact-buttons">
                            <a href="https://discord.gg/FqdMuyhdTC" target="_blank" rel="noopener noreferrer"
                                class="contact-btn discord-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                                </svg>
                                Discord
                            </a>
                            <a href="mailto:contact@ranzak.site" class="contact-btn email-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                Email
                            </a>
                        </div>

                        <p>
                            <strong>Future Development Plans:</strong>
                        </p>
                        <ul>
                            <li>🔧 <strong>More diverse applications:</strong> Browser, Code Decoder, Terminal, System
                                Monitor, File Explorer etc.</li>
                            <li>🎯 <strong>More exciting missions:</strong> International espionage, Cybercrime,
                                Counter-terrorism</li>
                            <li>🕵️ <strong>Advanced investigation tools:</strong> DNS analysis, Digital fingerprinting,
                                AI assistant</li>
                            <li>🌐 <strong>Real-time network simulations:</strong> Live traffic analysis, Firewall
                                configuration</li>
                            <li>🎮 <strong>Multiplayer investigations:</strong> Teamwork with real agents</li>
                            <li>🏆 <strong>Career progression system:</strong> Ranks, Specializations, Experience points
                            </li>
                            <li>📱 <strong>Mobile support:</strong> Potential future mobile version of the laptop
                                experience</li>
                        </ul>
                    </div>

                    <div class="donation-section">
                        <a href="https://linktr.ee/botpingie" target="_blank" rel="noopener noreferrer"
                            class="donate-button">
                            ☕ Support Development
                        </a>
                        <p class="donation-note">
                            Any contribution helps us continue developing this project!
                        </p>
                    </div>
                </div>
            </div>

            <div class="completion-actions">
                <button class="btn-primary" @click="returnToMenu">
                    Return to Main Menu
                </button>
                <button class="btn-secondary" @click="restartCase(completionData!.missionId)">
                    Play Again
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { isCompletionModalVisible, completionData, hideCompletionModal, restartCase } = useMissionCompletion();
const gameStore = useGameStore();

const handleOverlayClick = () => { };

const returnToMenu = async () => {
    const completedMissionId = hideCompletionModal();
    gameStore.exitLaptop();

    if (completedMissionId) {
        window.dispatchEvent(new CustomEvent('missionCompleted', {
            detail: { missionId: completedMissionId }
        }));
    }

    await navigateTo('/');
};
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/MissionCompletionModal';
</style>
