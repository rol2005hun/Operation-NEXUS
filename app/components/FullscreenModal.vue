<template>
    <div v-if="showModal" class="fullscreen-modal" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>For the Best Experience</h2>
                <button class="close-btn" @click="closeModal">&times;</button>
            </div>

            <div class="modal-body">
                <div class="recommendation-text">
                    <p>For the best gaming experience, we recommend enabling fullscreen mode.</p>
                    <p>This allows for complete immersion in your investigation.</p>
                </div>

                <div class="controls-info">
                    <div class="control-item">
                        <kbd>F11</kbd>
                        <span>Toggle fullscreen mode</span>
                    </div>
                    <div class="control-item">
                        <kbd>ESC</kbd>
                        <span>Exit laptop</span>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn-fullscreen" @click="enterFullscreen">
                        📺 Enable Fullscreen
                    </button>
                    <button class="btn-dont-show" @click="continueWithoutFullscreen">
                        Do not show again
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const showModal = ref(false);

const fullscreenDismissed = useCookie('nexus-fullscreen-dismissed', {
    default: () => false,
    maxAge: 60 * 60 * 24 * 365 * 10
});

const checkFullscreen = () => {
    const fullscreenDoc = document as FullscreenDocument;
    const isDocumentFullscreen = !!(document.fullscreenElement ||
        fullscreenDoc.webkitFullscreenElement ||
        fullscreenDoc.mozFullScreenElement ||
        fullscreenDoc.msFullscreenElement);

    const isMediaFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

    const isWindowFullscreen = window.outerWidth === screen.width && window.outerHeight === screen.height;

    return isDocumentFullscreen || isMediaFullscreen || isWindowFullscreen;
};

const enterFullscreen = async () => {
    try {
        const element = document.documentElement as FullscreenElement;

        if (element.requestFullscreen) {
            await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            await element.msRequestFullscreen();
        }

        closeModal();
    } catch (error) {
        console.warn('Fullscreen request failed:', error);
        closeModal();
    }
};

const continueWithoutFullscreen = () => {
    fullscreenDismissed.value = true;
    closeModal();
};

const closeModal = () => {
    showModal.value = false;
};

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showModal.value) {
        closeModal();
    }
};

onMounted(() => {
    const isFullscreen = checkFullscreen();

    if (!isFullscreen && !fullscreenDismissed.value) {
        setTimeout(() => {
            const stillNotFullscreen = !checkFullscreen();
            if (stillNotFullscreen) {
                showModal.value = true;
            }
        }, 300);
    }

    const handleFullscreenChange = () => {
        if (checkFullscreen() && showModal.value) {
            closeModal();
        }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', () => { });
    document.removeEventListener('webkitfullscreenchange', () => { });
    document.removeEventListener('mozfullscreenchange', () => { });
    document.removeEventListener('MSFullscreenChange', () => { });
    window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/FullscreenModal';
</style>